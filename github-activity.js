async function fetchAPI(username) {
    const url = `https://api.github.com/users/${username}/events`
    try {
        const response = await fetch(url);
        if(!response.ok){
            throw new Error(`Failed to fetch data ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error.mesasge);
    }
}
async function renderActivity(username){
    const data = await fetchAPI(username);
    if (!data || data.length === 0) {
        console.log(`No recent activity found for user: ${username}`);
        return;
      }
    for(let event of data){
        let activityMessage = `${event.type} in repository : ${event.repo.name}`;
        switch(event.type){
            case "PushEvent":
                let commitsCount = event.payload.size;
                let commitMessages = event.payload.commits.map(commit => commit.message);   
                activityMessage += `\n- Pushed ${commitsCount} commit to ${event.repo.name} \n Messages: ${commitMessages}`;
                break;
            case "IssuesEvent":
                let issue = event.payload.issue;
                activityMessage += `\n Issue: ${issue.title} \n Action: ${event.payload.action}`;
                break;
            case "WatchEvent":
                activityMessage += `\n Starred the repository ${event.repo.name}`;
                break;
            case "ForkEvent":
                activityMessage += `\n Forked the repository ${event.repo.name}`;
                break;
            case "CreateEvent":
                activityMessage += `\n Created the repository ${event.repo.name}`;
                break;
            default:
                activityMessage += `\n  Other event type: ${event.type}`;
                break;
        }
        console.log(activityMessage);
        console.log("-".repeat(50)); 
    }
}

const username = process.argv[2];

if (!username) {
  console.log("Usage: node github-activity.js <GitHub username>");
} else {
  renderActivity(username);
}