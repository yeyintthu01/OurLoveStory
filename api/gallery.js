module.exports = async (req, res) => {
  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  const DATABASE_ID = "32249e6b779a802abfb0fbb56773e25f";

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  if (!NOTION_TOKEN) {
    return res.status(500).json({ error: "NOTION_TOKEN not set" });
  }

  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
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
      return res
        .status(response.status)
        .json({ error: `Notion API error: ${response.status}` });
    }

    const data = await response.json();

    const gallery = data.results.map((item) => ({
      Title: item.properties.Title?.title?.[0]?.plain_text || "Memory",
      Image:
        item.properties.Image?.url ||
        "https://via.placeholder.com/300x300?text=No+Image",
      Description:
        item.properties.Description?.rich_text?.[0]?.plain_text || "",
    }));

    return res.status(200).json(gallery);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
};
