document.addEventListener('DOMContentLoaded', function () {
    const searchbtn = document.getElementById("search-btn")
    const userinput = document.getElementById("user-input")
    const statscont = document.querySelector(".stats-cont")
    const easyprogresscircle = document.querySelector(".easy-progress")
    const mediumprogresscircle = document.querySelector(".medium-progress")
    const hardprogresscircle = document.querySelector(".hard-progress")
    const easylabel = document.getElementById("easy-label")
    const mediumlabel = document.getElementById("medium-label")
    const hardlabel = document.getElementById("hard-label")
    const statscard = document.querySelector(".stats-card")

    function validusername(username) {
        if (username.trim() === "") {
            alert("username should not be empty.")
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const ismatching = regex.test(username);
        if (!ismatching) {
            alert("Invalid username")
        }
        return ismatching;
    }

    async function fetchuserDetails(username) {
        try {
            searchbtn.textContent = "Searching...";
            searchbtn.disabled = true;

            const mainurl = `https://leetcode-stats-api.herokuapp.com/${username}`
            const response = await fetch(mainurl);

            if (!response.ok) {
                throw new Error("Unable to fetch the User details");
            }

            const parsedData = await response.json();
            console.log("loading data: ", parsedData);

            displayUserData(parsedData);
        }
        catch (error) {
            statscont.innerHTML = `<p>${error.message}</p>`
        }
        finally {
            searchbtn.textContent = "Search";
            searchbtn.disabled = false;
        }
    }

    function updateprogress(solved, total, label, circle) {
        const progressdegree = (solved / total) * 100;
        circle.style.setProperty("--process-degree", `${progressdegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(parsedData) {
        const totalquestions = parsedData.totalQuestions;
        const totaleasy = parsedData.totalEasy;
        const totalmedium = parsedData.totalMedium
        const totalhard = parsedData.totalHard
        const easysolved = parsedData.easySolved
        const mediumsolved = parsedData.mediumSolved
        const hardsolved = parsedData.hardSolved
        const totalsolved = parsedData.totalSolved
        const acceptancerate = parsedData.acceptanceRate

        updateprogress(easysolved, totaleasy, easylabel, easyprogresscircle);
        updateprogress(mediumsolved, totalmedium, mediumlabel, mediumprogresscircle);
        updateprogress(hardsolved, totalhard, hardlabel, hardprogresscircle);

        const carddata = [
            { label: "Acceptance Rate", value: acceptancerate + "%" },
            { label: "Total Questions", value: totalquestions },
            { label: "Total Solved", value: totalsolved }
        ];

        statscard.innerHTML = carddata.map(
            data =>
                `<div class="card">
                    <h4>${data.label}</h4>
                    <p>${data.value}</p>
                </div>`).join("")
    }

    searchbtn.addEventListener('click', function () {
        const username = userinput.value;
        console.log("logging user name: " + username)
        if (validusername(username)) {
            fetchuserDetails(username);
        }
    })
})