export type ApiResponseError = {
  message: string;
  info?: string;
};

export type ApiResponse = {
  success: boolean;
  result?: object;
  error?: ApiResponseError;
};

async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse> {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (response.ok) {
      return {
        success: true,
        result: await response.json(),
      };
    } else {
      const info = await response.json().catch(() => undefined);
      return {
        success: false,
        error: {
          message: `HTTP ${response.status}`,
          info: info,
        },
      };
    }
  } catch (err) {
    return {
      success: false,
      error: {
        message: "Internal client error",
        info: err instanceof Error ? err.message : String(err),
      },
    };
  }
}

export async function getSettings(
  apiUrl: string,
  idInstance: string,
  apiTokenInstance: string,
) {
  return (await apiFetch(
    `${apiUrl}/waInstance${idInstance}/getSettings/${apiTokenInstance}`,
    { method: "GET" },
  ));
}
export async function getStateInstance(
  apiUrl: string,
  idInstance: string,
  apiTokenInstance: string,
) {
  return (await apiFetch(
    `${apiUrl}/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`,
    { method: "GET" },
  ));
}
export async function sendMessage(
  apiUrl: string,
  idInstance: string,
  apiTokenInstance: string,
  chatId: string,
  message: string,
) {
  return (await apiFetch(
    `${apiUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
    {
      method: "POST",
      body: JSON.stringify({
        chatId,
        message,
      }),
    },
  ));
}
export async function sendFileByUrl(
  apiUrl: string,
  idInstance: string,
  apiTokenInstance: string,
  chatId: string,
  urlFile: string,
  fileName: string,
) {
  return (await apiFetch(
    `${apiUrl}/waInstance${idInstance}/sendFileByUrl/${apiTokenInstance}`,
    {
      method: "POST",
      body: JSON.stringify({
        chatId,
        urlFile,
        fileName,
      }),
    },
  ));
}
