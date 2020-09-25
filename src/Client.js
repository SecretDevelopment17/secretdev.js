"use strict";

const request = require("node-superfetch");

class SecretDevClient {
	/**
   * Create a new Api Wrapper instance.
   * @param {any} [client] You client instance for package discord
	 */
	constructor(client) {
		const blockedTypeof = ["number", "string", "boolean"];

		if (blockedTypeof.includes(typeof client)) throw new Error("Please provide for client packages.");
		
		this.client = client;
	}

	/**
	 * Get information about a bot with jsons.
	 * @param {?String} id This ID of the bot you want to get the informations
	 * @return {Promise<object>}
	 */
	async getBot(id) {
		if (!id && !this.client) throw new Error("[getBot] No provide someone for bot IDs.");
		if (!id || isNaN(id)) id = this.client.user.id;

		const { body } = await request.get(`https://api.secretdev.tech/api/bots/${id}`);

		return body;
	}

	/**
	 * Get Array in object find the api
	 * @param {Object} obj this a when object the find
	 * @param {?String} [obj.ownerID] this a when object with owner developer
	 * @param {?String} [obj.prefix] this a when object with same the prefix many bots.
	 * @return {Promise<object>}
	 */
	async botsArray(obj) {
		const blockType = ["number", "string", "boolean"];

		if (blockType.includes(typeof obj)) throw new Error("[botsArray] No provide some with object structures.");

		const { body } = await request.get("https://api.secretdev.tech/api/botsArray");

		if (obj.ownerID !== undefined && obj.prefix !== undefined) {
			if (!obj.ownerID || isNaN(obj.ownerID)) throw new Error("[botsArray] No provide someone for developer IDs.");
			else if (!obj.prefix) throw new Error("[botsArray] No provide someone for prefix Bots.");

			const bots = body.filter(x => x.ownerID.includes(obj.ownerID) && x.prefix.includes(obj.prefix));

			return bots;
		} else if (obj.ownerID !== undefined) {
			if (!obj.ownerID || isNaN(obj.ownerID)) throw new Error("[botsArray] No provide someone for developer IDs.");

			const bots = body.filter(x => x.ownerID.includes(obj.ownerID));

			return bots;
		} else if (obj.prefix !== undefined) {
			if (!obj.prefix) throw new Error("[botsArray] No provide someone for prefix bots.");

			const bots = body.filter(x => x.prefix.includes(obj.prefix));

			return bots;
		} else throw new Error("[botsArray] Invalid a Object Structures.");
	}

	/**
   * Get fetchUser api with discord api of client
   * @param {?String} id This ID of users on discord ID
   * @return {Promise<object>}
	 */
	async getUser(id) {
		if (!id || isNaN(id)) throw new Error("[getUser] No provide someone for discord IDs.");

		const { body: botsArray } = await request.get("https://api.secretdev.tech/api/botsArray");

		if (this.client.users.fetch !== undefined) {
			const user = await this.client.users.fetch(id);

			if (!user) return {
				error: { message: "Invalid discord IDs", code: 404 }
			};

			const body = {
				id: user.id,
				discriminator: user.discriminator,
				tag: user.tag,
				username: user.username,
				createdAt: new Date(user.createdTimestamp).toString(),
				createdTimestamp: user.createdTimestamp,
				avatar: {
					sd: { uri: user.displayAvatarURL({ dynamic: true, size: 512 }) },
					hd: { uri: user.displayAvatarURL({ dynamic: true, size: 1024 }) },
					fhd: { uri: user.displayAvatarURL({ dynamic: true, size: 2048 }) }
				},
				bot: user.bot
			};

			if (!user.bot) body.bots = botsArray.filter(x => x.ownerID === user.id) || [];

			return body;
		} else if (this.client.fetchUser !== undefined) {
			const user = await this.client.fetchUser(id);

			if (!user) return {
				error: { message: "Invalid discord IDs", code: 404 }
			};

			const body = {
				id: user.id,
				discriminator: user.discriminator,
				tag: user.tag,
				username: user.username,
				createdAt: new Date(user.createdTimestamp).toString(),
				createdTimestamp: user.createdTimestamp,
				avatar: user.avatar,
				avatarURL: user.avatarURL,
				displayAvatarURL: user.displayAvatarURL,
				bot: user.bot
			};

			if (!user.bot) body.bots = botsArray.filter(x => x.ownerID === user.id) || [];

			return body;
		} else throw new Error("[getUser] this library for fetchUser is not yet a supported.");
	}
}

module.exports = SecretDevClient;
