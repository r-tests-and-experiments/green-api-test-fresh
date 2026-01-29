import { useState } from "preact/hooks";
import {
  ApiResponse,
  getSettings,
  getStateInstance,
  sendFileByUrl,
  sendMessage,
} from "@/api/api.ts";

export default function Form() {
  const [result, resultSet] = useState("");
  const [isLoading, isLoadingSet] = useState(false);
  const [isError, isErrorSet] = useState(false);

  const [apiUrl, apiUrlSet] = useState("");
  const [idInstance, idInstanceSet] = useState("");
  const [apiTokenInstance, apiTokenInstanceSet] = useState("");
  const [chatIdMessage, chatIdMessageSet] = useState("");
  const [message, messageSet] = useState("");
  const [chatIdFile, chatIdFileSet] = useState("");
  const [urlFile, urlFileSet] = useState("");
  const [fileName, fileNameSet] = useState("");

  function requestStart() {
    isLoadingSet(true);
    isErrorSet(false);
    resultSet("");
  }
  function requestEnd(data: ApiResponse) {
    resultSet(JSON.stringify(data, null, 2));
    isLoadingSet(false);
    isErrorSet(!data.success);
  }
  function validateUrl(url: string) {
    return URL.canParse(url) &&
      (url.startsWith("https://") || url.startsWith("http://"));
  }
  function validateBaseArguments() {
    return validateUrl(apiUrl) && idInstance && apiTokenInstance;
  }

  const getSettingsHandler = async () => {
    requestStart();
    requestEnd(
      await getSettings(
        apiUrl,
        idInstance,
        apiTokenInstance,
      ),
    );
  };

  const getStateInstanceHandler = async () => {
    requestStart();
    requestEnd(
      await getStateInstance(
        apiUrl,
        idInstance,
        apiTokenInstance,
      ),
    );
  };

  const sendMessageHandler = async () => {
    requestStart();
    requestEnd(
      await sendMessage(
        apiUrl,
        idInstance,
        apiTokenInstance,
        chatIdMessage,
        message,
      ),
    );
  };

  const sendFileByUrlHandler = async () => {
    requestStart();
    requestEnd(
      await sendFileByUrl(
        apiUrl,
        idInstance,
        apiTokenInstance,
        chatIdFile,
        urlFile,
        fileName,
      ),
    );
  };

  return (
    <>
      <div style="display: flex; width: 100%; min-width: 480px">
        <div style="flex: 1; width: 50%;">
          <div className="block">
            <input
              type="text"
              value={apiUrl}
              onInput={(e) => apiUrlSet((e.target as HTMLInputElement).value)}
              placeholder="apiUrl"
              maxlength={1000}
            />
            <input
              type="text"
              value={idInstance}
              onInput={(e) =>
                idInstanceSet((e.target as HTMLInputElement).value)}
              placeholder="idInstance"
              maxlength={1000}
            />
            <input
              type="text"
              value={apiTokenInstance}
              onInput={(e) =>
                apiTokenInstanceSet((e.target as HTMLInputElement).value)}
              placeholder="apiTokenInstance"
              maxlength={1000}
            />
            <button
              type="button"
              onClick={getSettingsHandler}
              disabled={isLoading || !validateBaseArguments()}
            >
              getSettings
            </button>
            <button
              type="button"
              onClick={getStateInstanceHandler}
              disabled={isLoading || !validateBaseArguments()}
            >
              getStateInstance
            </button>
          </div>

          <div className="block">
            <input
              type="text"
              value={chatIdMessage}
              onInput={(e) =>
                chatIdMessageSet((e.target as HTMLInputElement).value)}
              placeholder="chatId"
              maxlength={1000}
            />
            <textarea
              value={message}
              onInput={(e) =>
                messageSet((e.target as HTMLTextAreaElement).value)}
              placeholder="Write a message..."
              maxlength={20000}
            />
            <button
              type="button"
              onClick={sendMessageHandler}
              disabled={isLoading || !validateBaseArguments() ||
                !chatIdMessage || !message}
            >
              sendMessage
            </button>
          </div>

          <div className="block">
            <input
              type="text"
              value={chatIdFile}
              onInput={(e) =>
                chatIdFileSet((e.target as HTMLInputElement).value)}
              placeholder="chatId"
              maxlength={1000}
            />
            <input
              type="text"
              value={urlFile}
              onInput={(e) => {
                const val = (e.target as HTMLInputElement).value;
                urlFileSet(val);
                if (validateUrl(val) && !fileName) {
                  fileNameSet(new URL(val).pathname.split("/").pop() || "");
                }
              }}
              placeholder="urlFile"
              maxlength={1000}
            />
            <input
              type="text"
              value={fileName}
              onInput={(e) => fileNameSet((e.target as HTMLInputElement).value)}
              placeholder="fileName"
            />
            <button
              type="button"
              onClick={sendFileByUrlHandler}
              disabled={isLoading || !validateBaseArguments() ||
                !chatIdFile || !validateUrl(urlFile) || !fileName}
            >
              sendFileByUrl
            </button>
          </div>
        </div>
        <div style="width: 50%;">
          <p>response:</p>
          <div
            className="block"
            style={isError ? "background:#ffeeee" : "background:none"}
          >
            <pre>{result}</pre>
          </div>
        </div>
      </div>
    </>
  );
}
