import { OPENAI_API_KEY } from '$app/env/private';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const STYLES: Record<string, string> = {
	'white-bg':
		'Professional product photography on a clean white studio background, soft even lighting, high resolution, e-commerce ready',
	lifestyle:
		'Professional product photography in a modern interior lifestyle setting, natural lighting, editorial quality, catalog ready',
	gradient:
		'Professional product photography on a soft pastel gradient background, studio lighting, high resolution, catalog ready',
	transparent:
		'Product isolated on transparent background, clean edges, studio lighting, high resolution, e-commerce ready'
};

export const POST: RequestHandler = async ({ request }) => {
	if (!OPENAI_API_KEY) {
		error(500, 'OPENAI_API_KEY is not configured.');
	}

	const formData = await request.formData();
	const images = formData.getAll('images') as File[];
	const style = (formData.get('style') as string) || 'white-bg';

	if (!images.length) {
		error(400, 'At least one image is required.');
	}

	const stylePrompt = STYLES[style] || STYLES['white-bg'];

	try {
		const results = await Promise.all(
			images.map(async (image) => {
				const buffer = Buffer.from(await image.arrayBuffer());
				const mimeType = image.type || 'image/png';

				const response = await fetch('https://api.openai.com/v1/images.edit', {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${OPENAI_API_KEY}`
					},
					body: (() => {
						const fd = new FormData();
						const blob = new Blob([buffer], { type: mimeType });
						fd.append('image', blob, image.name);
						fd.append('prompt', stylePrompt);
						fd.append('model', 'gpt-image-1');
						fd.append('size', '1024x1024');
						fd.append('n', '1');
						return fd;
					})()
				});

				if (!response.ok) {
					const errBody = await response.text();
					throw new Error(`OpenAI API error (${response.status}): ${errBody}`);
				}

				const data = await response.json();
				const b64 = data.data?.[0]?.b64_json;
				const url = data.data?.[0]?.url;

				if (b64) {
					return { b64, mimeType: 'image/png' };
				} else if (url) {
					return { url };
				}
				throw new Error('No image data returned from OpenAI.');
			})
		);

		return json({ images: results });
	} catch (e) {
		const message = e instanceof Error ? e.message : 'Image generation failed.';
		error(502, message);
	}
};
