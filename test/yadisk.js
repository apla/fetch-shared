// https://yandex.ru/dev/disk/api/reference/public-docpage/
const folderLink = 'https://yadi.sk/d/R0CEdOfXSs7k6Q';
const fileLink = 'https://yadi.sk/i/Kz9iQ1-L94EcUQ';

const assert = require ('assert');

const yadisk = require ('../js/yadisk.js');

describe ('YaDisk', () => {
	describe ('shared folder', () => {
		it ('should have meta', () => {
			return yadisk.fetchingMeta (folderLink).then ((meta) => {
				assert.equal (meta.name, 'ttt');
				assert.equal (meta.type, 'dir');
				assert.equal (meta.total, 3);

				const dinamoPic  = meta.items.filter (entry => entry.name === 'DINAMO.png')[0];
				assert.equal (dinamoPic.type, 'file');
				assert.equal (dinamoPic.size, 393580);
				// image/png
				// 0efcb36b8bf10a3013b436188552053a027ad80e1a4af9b3fda4c5196f505d6b
				assert (dinamoPic.downloadUrl);

				const macosVideo = meta.items.filter (entry => entry.name === 'finder-arrange-none.mov')[0];
				assert.equal (macosVideo.type, 'file');
				assert.equal (macosVideo.size, 20612180);
				// 861649525a51a1d271eee675350049ef5b28dda4a51ce98aab375cf617322e42
				// video/quicktime
				assert (macosVideo.downloadUrl);

				const zzzFolder  = meta.items.filter (entry => entry.name === 'zzz')[0];
				assert.equal (zzzFolder.type, 'dir');
				assert.equal (zzzFolder.total, 0);
			});
		});
	});
	describe ('shared file', () => {
		it ('should have meta', () => {
			return yadisk.fetchingMeta (fileLink).then ((meta) => {
				assert.equal (meta.name, 'DINAMO.png');
				assert.equal (meta.type, 'file');
				assert (meta.downloadUrl);
			});
		});
	});
});