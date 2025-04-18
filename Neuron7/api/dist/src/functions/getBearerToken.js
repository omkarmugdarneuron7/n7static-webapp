"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBearerToken = void 0;
const functions_1 = require("@azure/functions");
const config_1 = __importDefault(require("./config"));
const node_fetch_1 = __importDefault(require("node-fetch")); // Ensure this is installed
function getBearerToken(req, context) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        context.log("Processing getBearerToken request...");
        // Fetch environment variables (set via Azure Function App Configuration)
        // Authentication URL
        const authUrl = `${config_1.default.N7BaseUrl}/security/user/authenticate`;
        try {
            // Authenticate with N7 API using credentials
            const authRes = yield (0, node_fetch_1.default)(authUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userName: config_1.default.N7Username, password: config_1.default.N7Password }), // Use the environment variables here
            });
            const authResBody = yield authRes.text();
            const bearerToken = (_a = authRes.headers.get("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
            if (!bearerToken) {
                context.log("Failed to retrieve bearer token:", authResBody);
                return {
                    status: 401,
                    body: JSON.stringify({ error: "Unauthorized: Token not received from Neuron7" }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                };
            }
            context.log("Successfully retrieved bearer token.");
            return {
                status: 200,
                body: JSON.stringify({
                    bearerToken,
                    baseUrl: config_1.default.N7BaseUrl
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            };
        }
        catch (error) {
            context.log("Error during authentication:", error);
            return {
                status: 500,
                body: JSON.stringify({ error: "Internal Server Error" }),
                headers: {
                    "Content-Type": "application/json",
                },
            };
        }
    });
}
exports.getBearerToken = getBearerToken;
functions_1.app.http("getBearerToken", {
    methods: ['GET', 'POST'],
    authLevel: "anonymous",
    handler: getBearerToken,
});
//# sourceMappingURL=getBearerToken.js.map