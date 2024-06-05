const { Octokit } = require("@octokit/rest");

function getContentRef(file) {
  const ref = file.contents_url.split('/').pop().match(/ref=([a-f0-9]{40})/i);
  return ref ? ref[1] : null;
}

async function fetchPRChanges(owner, repo, prNumber, githubToken) {
    const octokit = new Octokit({
        auth: githubToken
    });

    try {
        // Get list of files changed in the PR
        const { data: files } = await octokit.rest.pulls.listFiles({
            owner,
            repo,
            pull_number: prNumber
        });

        for (const file of files) {
            console.log(`Processing file: ${file.filename}`);
            console.log(file)

            // Fetch the raw content of the file at the specific commit (typically the head of the PR)
            const { data: fileData } = await octokit.rest.repos.getContent({
                owner,
                repo,
                path: file.filename,
                ref: getContentRef(file)
            });
            console.log(fileData);
            // Display the file content (base64 decoded)
            const fileContent = Buffer.from(fileData.content, 'base64').toString('utf-8');
            console.log(`File content of ${file.filename}:`);
            console.log(fileContent);

            // Display the patch showing changes
            console.log(`Patch for ${file.filename}:`);
            console.log(file.patch);
        }
    } catch (error) {
        console.error('Error fetching PR changes:', error.message);
    }
}

fetchPRChanges('jiangy10', 'monitored-repo-test', 1, process.env.GITHUB_TOKEN);
