require("dotenv").config();
const axios = require("axios");
const config = require("./config.json");
const figlet = require("figlet");

const STATUS_URL = "https://discord.com/api/v9/users/@me/settings";

const token = process.env.DISCORD_TOKEN;
const animation = config.animation;

if (!token) {
	console.error("Missing DISCORD_TOKEN in .env file");
	process.exit(1);
}

async function loop() {
	for (const anim of animation) {
		try {
			const res = await doRequest(anim.text, anim.emojiID, anim.emojiName);
			if (!res) {
				console.error("Failed to update status. Exiting loop.");
				return;
			}
			await new Promise(res => setTimeout(res, anim.timeout));
		} catch (err) {
			console.error("Error during status update:", err.message);
			return;
		}
	}

	loop(); // repeat
}

console.log(figlet.textSync("RENAS ROTATOR", { font: "Big Money-sw" }));
loop();

async function doRequest(text, emojiID = null, emojiName = null) {
	try {
		const response = await axios.patch(
			STATUS_URL,
			{
				custom_status: {
					text: text,
					emoji_id: emojiID,
					emoji_name: emojiName
				}
			},
			{
				headers: {
					Authorization: token,
					"Content-Type": "application/json"
				}
			}
		);

		return response.status === 200;
	} catch (error) {
		if (error.response) {
			console.error("Request failed:", error.response.status, error.response.data);
		} else {
			console.error("Error sending request:", error.message);
		}
		return false;
	}
}

	loop();
}
console.log("Running...");
loop();

function doRequest(text, emojiID = null, emojiName = null) {
	return new Promise((resolve, reject) => {
		request({
			method: "PATCH",
			uri: STATUS_URL,
			headers: {
				Authorization: config.token
			},
			json: {
				custom_status: {
					text: text,
					emoji_id: emojiID,
					emoji_name: emojiName
				}
			}
		}, (err, res, body) => {
			if (err) {
				reject(err);
				return;
			}

			if (res.statusCode !== 200) {
				reject(new Error("Invalid Status Code: " + res.statusCode));
				return;
			}

			resolve(true);
		});
	});
}
