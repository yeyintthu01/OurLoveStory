import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  const DATABASE_ID = "32249e6b779a8050ad1fc89b0b192986";

  if (!NOTION_TOKEN) {
    return res.status(500).json({ error: "NOTION_TOKEN not configured" });
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
        body: JSON.stringify({
          sorts: [
            {
              property: "Year",
              direction: "ascending",
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform Notion data to our format
    const timeline = data.results.map((item: any) => ({
      Year: item.properties.Year?.title?.[0]?.plain_text || "N/A",
      Title: item.properties.Title?.title?.[0]?.plain_text || "Untitled",
      Description:
        item.properties.Description?.rich_text?.[0]?.plain_text || "",
    }));

    res.status(200).json(timeline);
  } catch (error: any) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
}
