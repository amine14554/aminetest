import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

export function Dashboard() {
  const [selectedFriend, setSelectedFriend] = useState<Id<"users"> | null>(null);
  const profile = useQuery(api.users.getProfile);
  const friends = useQuery(api.friends.getFriends) ?? [];
  const messages = useQuery(api.messages.getMessages, 
    selectedFriend ? { otherId: selectedFriend } : "skip"
  );

  return (
    <div className="grid grid-cols-4 gap-6 h-[calc(100vh-5rem)]">
      {/* Sidebar */}
      <div className="col-span-1 bg-gray-900 rounded-lg border border-gray-800 p-4 overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            {profile?.avatarUrl && (
              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div>
              <h3 className="font-semibold text-white">{profile?.displayName}</h3>
              <p className="text-sm text-gray-400">@{profile?.username}</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm">{profile?.bio}</p>
          <div className="flex justify-between mt-4 text-sm text-gray-400">
            <span>{profile?.followers} متابع</span>
            <span>{profile?.following} يتابع</span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-gray-400 mb-2">الأصدقاء</h4>
          {friends.filter(friend => friend !== null).map((friend) => (
            <button
              key={friend._id.toString()}
              onClick={() => setSelectedFriend(friend.userId)}
              className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                selectedFriend === friend.userId
                  ? "bg-blue-600/20 text-blue-400"
                  : "hover:bg-gray-800 text-gray-300"
              }`}
            >
              {friend.avatarUrl && (
                <img
                  src={friend.avatarUrl}
                  alt={friend.displayName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <span>{friend.displayName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="col-span-3 bg-gray-900 rounded-lg border border-gray-800 p-4 flex flex-col">
        {selectedFriend ? (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages?.map((message) => (
                <div
                  key={message._id.toString()}
                  className={`flex ${
                    message.senderId === profile?.userId ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.senderId === profile?.userId
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-300"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
            <ChatInput friendId={selectedFriend} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            اختر صديقاً للدردشة معه
          </div>
        )}
      </div>
    </div>
  );
}

function ChatInput({ friendId }: { friendId: Id<"users"> }) {
  const [message, setMessage] = useState("");
  const sendMessage = useMutation(api.messages.sendMessage);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await sendMessage({
        receiverId: friendId,
        content: message,
      });
      setMessage("");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
        placeholder="اكتب رسالتك..."
        dir="rtl"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        إرسال
      </button>
    </form>
  );
}
