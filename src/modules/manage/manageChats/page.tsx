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
      <h2>Manage chats</h2>
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
        Load chat from file
      </button>
      {error && <p>{error}</p>}
    </>
  );
};
