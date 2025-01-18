import { ChangeEvent, useState } from "react";
import { Profile } from "../../../interfaces/profile";
import { useAppSelector } from "../../../store/storeHooks";
import { manageProfilesState } from "../manageProfiles/manageProfilesSlice";
import date from "date-and-time";
import { ChatService } from "../../../services/chat";
import { MessageService } from "../../../services/message";
import { manageUniversesState } from "../manageUniversesSlice";
import axios from "axios";
import { Buffer } from "buffer";

type ParsedData = {
  metadata: {
    profileIds: string[];
    profileCreatorId: string;
    chatName: string;
    chatImageBuffer?: Buffer;
  };
  chatMessages: {
    profileId: string;
    message: string;
    timestamp: Date;
  }[];
};

type Props = {
  chatService: ChatService;
  messageService: MessageService;
};

export const useLoadChats = ({ chatService, messageService }: Props) => {
  const { universe } = useAppSelector(manageUniversesState);
  const { profiles } = useAppSelector(manageProfilesState);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [parsedData, setParsedData] = useState<ParsedData[] | null>(null);

  const loadChats = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files;
      if (!files || !files.length) {
        return;
      }
      const parsedFiles = await Promise.all(
        Array.from(files).map((file) => processFile(file))
      );
      setParsedData(parsedFiles);
      setSelectedFiles(files);
      setError("");
    } catch (error) {
      console.error("Error loading chats", error);
      const message =
        (error as Error).message || "Ha ocurrido un error cargando los chats";
      setError(message);
      // Clear input value to allow reuploading the same file
      e.target.value = "";
      e.target.files = null;
      e.target.type = "text";
      e.target.type = "file";
      setSelectedFiles(null);
    }
  };
  const processFile = async (file: File): Promise<ParsedData> => {
    const reader = new FileReader();
    reader.readAsText(file);
    return new Promise<ParsedData>((resolve, reject) => {
      reader.onload = async () => {
        try {
          const result = reader.result as string;
          const fileContent = result.split("\n").map((line) => {
            const cell = [];
            // Split the line by commas. Beware that commas inside quotes are not split.
            let insideQuotes = false;
            let cellValue = "";
            for (let i = 0; i < line.length; i++) {
              const char = line[i];
              if (char === '"') {
                insideQuotes = !insideQuotes;
              } else if (char === "," && !insideQuotes) {
                cell.push(cellValue);
                cellValue = "";
              } else {
                cellValue += char;
              }
            }
            cell.push(cellValue);
            return cell;
          });
          // const metadataHeaders = fileContent[0];
          const rawMetadata = fileContent[1];
          // const chatHeader = fileContent[3];
          const chatMessagesStartIndex = 4;
          let chatMessagesEndIndex = fileContent.findIndex(
            (line, i) => i >= 4 && line.length !== 3
          );
          if (chatMessagesEndIndex === -1) {
            chatMessagesEndIndex = fileContent.length;
          }
          const rawChatMessages = fileContent.slice(
            chatMessagesStartIndex,
            chatMessagesEndIndex
          );
          const metadata = await validateMetadata(rawMetadata, profiles);
          const chatMessages = validateChats(rawChatMessages, profiles);
          resolve({
            metadata,
            chatMessages,
          });
        } catch (error) {
          console.error("Error processing file " + file.name, error);
          reject(error);
        }
      };
    });
  };
  const createChatsAndMessagesFromFiles = async () => {
    if (!universe || !parsedData) {
      return;
    }
    setLoading(true);
    await Promise.all(
      parsedData.map((data) =>
        createChatsAndMessagesFromFile(data, universe.id)
      )
    );
    setLoading(false);
    setSelectedFiles(null);
  };
  const createChatsAndMessagesFromFile = async (
    parsedData: ParsedData,
    universeId: string
  ) => {
    try {
      let existingChats =
        (await chatService.getChatsByName(
          parsedData!.metadata.chatName,
          universeId
        )) || [];
      if (parsedData.metadata.profileIds.length === 2) {
        const privateChat = await chatService.getPrivateChatByMembers(
          parsedData.metadata.profileIds,
          universeId
        );
        if (privateChat) {
          existingChats = [...existingChats, ...privateChat];
        }
      }
      if (existingChats.length) {
        await Promise.all(
          existingChats.map(async (chat) => {
            await messageService.removeMessagesByChat(chat.id);
            await chatService.removeChat(chat.id);
          })
        );
      }
      const newChat = await chatService.createChat({
        universeId: universeId,
        name: parsedData!.metadata.chatName,
        image: parsedData!.metadata.chatImageBuffer,
        isGroup: parsedData!.metadata.profileIds.length > 2,
        members: parsedData!.metadata.profileIds,
        creatorId: parsedData!.metadata.profileCreatorId,
      });
      await Promise.all(
        parsedData!.chatMessages.map((chatMessage) =>
          messageService.createMessage({
            chatId: newChat.id,
            text: chatMessage.message,
            senderId: chatMessage.profileId,
            timestamp: chatMessage.timestamp,
          })
        )
      );
      setError("");
    } catch (error) {
      console.error("Error creating chats and messages from file", error);
      const message =
        (error as Error).message ||
        "Error creando chats y mensajes desde el archivo";
      setError(message);
    }
  };
  return {
    loadChats,
    selectedFiles,
    createChatsAndMessagesFromFiles,
    error,
    loading,
  };
};

const validateMetadata = async (
  metadata: string[],
  existingProfiles: Profile[]
): Promise<{
  profileIds: string[];
  profileCreatorId: string;
  chatName: string;
  chatImageBuffer?: Buffer;
}> => {
  const [profileAliasesList, profileCreatorAlias, chatName, chatImage] =
    metadata;
  const profileAliases = profileAliasesList.split(",");
  if (profileAliases.length < 2) {
    throw new Error("Deben haber al menos dos alias de perfil");
  }
  const existingProfileAliasesSet = new Set(
    existingProfiles.map((profile) => profile.alias)
  );
  for (const alias of profileAliases) {
    if (!existingProfileAliasesSet.has(alias)) {
      throw new Error(`Perfil con alias ${alias} no encontrado`);
    }
  }
  const profileIds = profileAliases.map(
    (alias) => existingProfiles.find((profile) => profile.alias === alias)!.id
  );
  if (!profileAliases.includes(profileCreatorAlias)) {
    throw new Error(
      "Alias del perfil creador debe estar en la lista de perfiles"
    );
  }
  const profileCreatorId = existingProfiles.find(
    (profile) => profile.alias === profileCreatorAlias
  )!.id;
  if (profileAliases.length > 2 && !chatName) {
    throw new Error("Nombre del chat es obligatorio para chats grupales");
  }
  // If chat image exists, validate it's a valid URL and fetch the image to store it
  let chatImageBuffer: Buffer | undefined;
  if (chatImage) {
    try {
      const imageUrl = new URL(chatImage);
      // Fetch the image to store it in storage
      const imageResponse = await axios.get(imageUrl.toString(), {
        responseType: "arraybuffer",
      });
      if (!Buffer.isBuffer(Buffer.from(imageResponse.data))) {
        throw new Error("URL no apunta a una imagen válida");
      }
      chatImageBuffer = imageResponse.data;
    } catch (error) {
      console.error(error);
      throw new Error("URL de imagen de chat inválida");
    }
  }
  return { profileIds, profileCreatorId, chatName, chatImageBuffer };
};

const validateChats = (
  chats: string[][],
  existingProfiles: Profile[]
): {
  profileId: string;
  message: string;
  timestamp: Date;
}[] => {
  const existingProfileMap = new Map(
    existingProfiles.map((profile) => [profile.alias, profile])
  );
  let lastAlias = "";
  const chatMessages = [];
  for (const chat of chats) {
    const [alias, message, timestamp] = chat;
    if (alias) {
      lastAlias = alias;
    }
    if (!lastAlias) {
      throw new Error("Alias es obligatorio");
    }
    if (!existingProfileMap.has(lastAlias)) {
      throw new Error(`Perfil con alias ${lastAlias} no encontrado`);
    }
    if (!message) {
      throw new Error("Texto de mensaje es obligatorio");
    }
    if (!timestamp) {
      throw new Error("Timestamp es obligatorio");
    }
    const timestampDate = date.parse(timestamp, "DD/MM/YYYY HH:mm:ss", true);
    if (isNaN(timestampDate.getTime())) {
      throw new Error("Timestamp inválido");
    }
    chatMessages.push({
      profileId: existingProfileMap.get(lastAlias)!.id,
      message,
      timestamp: timestampDate,
    });
  }
  return chatMessages;
};
