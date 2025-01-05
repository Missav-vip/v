const GITHUB_TOKEN = "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";
const REPO_OWNER = "Missav-vip";
const REPO_NAME = "v";

async function updateGitHubFile(type, updatedData) {
    const filePath = type === "Kue" ? "scc/k/kue.json" : "css/p/plastik.json";
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`;

    try {
        // Dapatkan informasi file (SHA diperlukan untuk update)
        const { data: fileData } = await axios.get(url, {
            headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
        });

        // Encode data ke Base64
        const encodedContent = Buffer.from(JSON.stringify(updatedData, null, 2)).toString("base64");

        // Update file di GitHub
        await axios.put(
            url,
            {
                message: `Update ${type} data`,
                content: encodedContent,
                sha: fileData.sha,
            },
            { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } }
        );

        console.log(`File ${filePath} berhasil diperbarui di GitHub.`);
    } catch (error) {
        console.error("Error updating file on GitHub:", error);
    }
}
