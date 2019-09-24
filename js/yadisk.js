// https://yadi.sk/d/VYzGYv3xjQNJc

const {callingJsonApi} = require ('./http-helpers.js');

const apiUrlPrefix = "https://cloud-api.yandex.net/v1/disk/public/resources?public_key=";

function parseMeta (jsonRes) {

	let typeSpecific = {};

	if (jsonRes.type === 'dir') {
		typeSpecific = parseDirMeta (jsonRes);
	} else if (jsonRes.type === 'file') {
		typeSpecific = parseFileMeta (jsonRes);
	}

	const meta = Object.assign ({
		name:     jsonRes.name,
		type:     jsonRes.type,
		created:  new Date (jsonRes.created),
		modified: new Date (jsonRes.modified)
	}, typeSpecific);

	return meta;
}

function parseFileMeta (jsonRes) {
	return {
		name:     jsonRes.name,
		type:     jsonRes.type,
		size:     jsonRes.size,
		checksum: {
			sha256: jsonRes.sha256,
			md5:    jsonRes.md5,
		},
		
		created:  new Date (jsonRes.created),
		modified: new Date (jsonRes.modified),
		
		mimeType: jsonRes.mime_type,
		downloadUrl: jsonRes.file,
	}
}

function parseDirMeta (jsonRes) {
	
	if (!jsonRes._embedded) {
		return {
			items: [],
			total: 0
		};
	}

	return {
		items:  jsonRes._embedded.items.map (parseMeta),
		total:  jsonRes._embedded.total,
		limit:  jsonRes._embedded.limit,
		offset: jsonRes._embedded.offset
	};

}

function fetchingMeta (url) {
	return callingJsonApi (apiUrlPrefix + url).then (({apiResponse}) => {
		return Promise.resolve (parseMeta (apiResponse));
	})
}

module.exports = {
	fetchingMeta
}

if (require.main === module) {
	
	fetchingMeta (process.argv[2]).then (json => console.log (json));
}