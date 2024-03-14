// Function to fetch user information from the GitHub API
async function getUsers(names) {
// Add your own Token
    const accessToken = 'YOUR_PERSONAL_ACCESS_TOKEN';
  
    const jobs = [];
  
    for (let name of names) {
      const url = `https://api.github.com/users/${name}`; // Construct the URL to fetch user data
  
      // Create headers for the API request
      const headers = new Headers({
        'Authorization': `token ${accessToken}`, // Include access token for authentication
        'Accept': 'application/json' // Specify that we expect JSON response
      });
  
      // Queue a fetch request for each user
      jobs.push(
        fetch(url, { // Use fetch to make the API request
          method: 'GET',
          headers
        })
          .then(async (response) => {
            if (!response.ok) { // Check for successful response
              throw new Error(`Error fetching user ${name}: ${response.status}`);
            }
  
            return await response.json(); // Parse the response as JSON
          })
          .catch((error) => {
            console.error(`Error fetching user ${name}:`, error); // Handle errors
          })
      );
    }
  
    const results = await Promise.all(jobs); // Wait for all requests to complete
    return results; // Return the array of user data
  }
  
  // Main function to orchestrate calls and handle results
  async function main() {
    const names = ['siddhengineer']; // Array of user names to fetch
  
    try {
      const userResults = await getUsers(names); // Get user information
  
      // Process user results and extract repository information
      for (const userData of userResults) {
        if (userData.hasOwnProperty('repos_url')) { // Check if user data has 'repos_url' property
          const reposUrl = userData.repos_url;
  
          try {
            const response = await fetch(reposUrl); // Fetch repository data
            if (!response.ok) {
              throw new Error(`Error fetching repositories for user ${userData.login}: ${response.status}`);
            }
  
            const repoData = await response.json(); // Parse repository data as JSON
  
            // Print the names of the repositories
            console.log(`User ${userData.login}'s repositories:`);
            for (const repo of repoData) {
              console.log(`  - ${repo.name}`);
            }
          } catch (error) {
            console.error(`Error fetching repositories for user ${userData.login}:`, error);
          }
        } else {
          console.log(`User ${userData.login} does not have a 'repos_url' property.`);
        }
      }
    } catch (error) {
      console.error('Error:', error); // Handle top-level errors
    }
  }
  
  // Start the process
  main();
  