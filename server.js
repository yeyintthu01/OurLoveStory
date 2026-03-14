const http = require("http");
const url = require("url");

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const TIMELINE_DB = "32249e6b779a8050ad1fc89b0b192986";
const GALLERY_DB = "32249e6b779a802abfb0fbb56773e25f";

async function fetchNotionData(dbId) {
  console.log(`Fetching from Notion DB: ${dbId}`);
  console.log(`Using token: ${NOTION_TOKEN ? "YES" : "NO"}`);

  const response = await fetch(
    `https://api.notion.com/v1/databases/${dbId}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ page_size: 100 }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Notion API error:", response.status, errorText);
    throw new Error(`Notion API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log("Notion response received, items:", data.results.length);
  return data;
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  console.log(`Request: ${pathname}`);

  try {
    if (pathname === "/api/timeline") {
      const data = await fetchNotionData(TIMELINE_DB);
      const timeline = data.results.map((item) => {
        console.log("Item properties:", Object.keys(item.properties));
        return {
          Year: item.properties.Year?.title?.[0]?.plain_text || "N/A",
          Title: item.properties.Title?.title?.[0]?.plain_text || "Untitled",
          Description:
            item.properties.Description?.rich_text?.[0]?.plain_text || "",
        };
      });
      console.log("Timeline response:", timeline);
      res.writeHead(200);
      res.end(JSON.stringify(timeline));
    } else if (pathname === "/api/gallery") {
      const data = await fetchNotionData(GALLERY_DB);
      const gallery = data.results.map((item) => {
        console.log("Item properties:", Object.keys(item.properties));
        return {
          Title: item.properties.Title?.title?.[0]?.plain_text || "Memory",
          Image:
            item.properties.Image?.url ||
            "https://via.placeholder.com/300x300?text=No+Image",
          Description:
            item.properties.Description?.rich_text?.[0]?.plain_text || "",
        };
      });
      console.log("Gallery response:", gallery);
      res.writeHead(200);
      res.end(JSON.stringify(gallery));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Not found" }));
    }
  } catch (error) {
    console.error("Error:", error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: error.message }));
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
