import * as clipboard from "clipboard";

const args = Deno.args;
const [link] = args;
let ext = "png";
const IMAGE_TYPE_REG = /image\/(j?p[en]?g)/i;

const imageBuffer = await fetch(link)
	.then((res) => {
		if (res.status === 200) {
			const type = res.headers.get("content-type") ||
				res.headers.get("ContentType") || "";
			const regMatch = IMAGE_TYPE_REG.exec(type);
			if (!regMatch) {
				return Promise.reject(`not support image type ${type}`);
			} else {
				ext = regMatch[1] || ext;
			}
			return res.arrayBuffer();
		}
		return Promise.reject("fetch image error");
	})
	.catch((err) => {
		console.error(err);
	});

if (imageBuffer) {
	const str = new Uint8Array(imageBuffer).reduce(
		(acc, next) => acc + String.fromCharCode(next),
		"",
	);
	const base64Str = `data;image/${ext}:base64,${btoa(str)}`;
	console.info(base64Str);
	clipboard.writeText(base64Str);
}
