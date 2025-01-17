import { servicesCollection } from "../../../services/servicesCollection";
import { useLoadChats } from "./useLoadChats";

export const ManageChatsPage = () => {
  const { error, loadChats, selectedFiles, createChatsAndMessagesFromFiles } =
    useLoadChats({
      chatService: servicesCollection.chat,
      messageService: servicesCollection.message,
    });
  return (
    <>
      <h2>Administra tus chats</h2>
      <input
        style={{
          alignSelf: "center",
        }}
        type="file"
        multiple
        accept=".csv"
        onChange={loadChats}
      />
      <button
        style={{
          alignSelf: "center",
        }}
        onClick={() => selectedFiles && createChatsAndMessagesFromFiles()}
        disabled={!selectedFiles}
      >
        Carga chats desde tus archivos
      </button>
      {error && <p>{error}</p>}
    </>
  );
};
