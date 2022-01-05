const PROXY_URL = "https://api-proxy.skalvstudio.workers.dev/corsproxy/"
const API_URL = "https://api.cloudflare.com/client/v4/accounts/70dec78a5939454a8fcd8c8fa205f00e/images/v1"

module.exports = {
  reactStrictMode: true,
  env: {
    CF_API_KEY: process.env.CF_API_KEY,
    CF_API_EMAIL: "fboutin@skalv-studio.fr",
    API_URL: `${PROXY_URL}?apiurl=${API_URL}`
  }
}
