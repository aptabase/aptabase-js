var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function init(appKey) {
    globalThis.__APTABASE__ = { appKey };
}
export function trackEvent(req, eventName, props) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const appKey = globalThis.__APTABASE__.appKey;
        if (!appKey)
            return Promise.resolve();
        const userAgent = (_a = req.headers['user-agent']) !== null && _a !== void 0 ? _a : '';
        const body = JSON.stringify({
            timestamp: new Date().toISOString(),
            sessionId: 'CHANGE-THIS',
            eventName: eventName,
            systemProps: {
                isDebug: true,
                locale: 'en',
                appVersion: '',
                sdkVersion: 'aptabase-node@0.1.0',
            },
            props: props,
        });
        try {
            const response = yield fetch('http://localhost:3000/api/v0/event', {
                method: 'POST',
                headers: {
                    'User-Agent': userAgent,
                    'Content-Type': 'application/json',
                    'App-Key': appKey,
                },
                credentials: 'omit',
                body,
            });
            if (response.status >= 300) {
                const responseBody = yield response.text();
                console.warn(`Failed to send event "${eventName}": ${response.status} ${responseBody}`);
            }
        }
        catch (e) {
            console.warn(`Failed to send event "${eventName}": ${e}`);
        }
    });
}
