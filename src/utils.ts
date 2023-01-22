import { createWriteStream } from "node:fs";
import { Readable } from "node:stream";
import { exec } from "node:child_process";
import util from "node:util";
import path from "node:path";

export const run = util.promisify(exec);

export const download = async (url: string | URL, path: string) => {
  const response = await fetch(url);
  if (response.body !== null) {
    return Readable.fromWeb(response.body as any).pipe(createWriteStream(path));
  }
};

interface EditImageOptions {
  imageURL: string;
  prompt: string;
  steps?: number | null;
  promptStrength?: number | null;
  negativePrompt?: string | null;
  seed?: string | null;
  fixFaces?: boolean | null;
  upscale?: boolean | null;
}

export const editImage = async ({
  imageURL,
  steps,
  prompt,
  promptStrength,
  negativePrompt,
  seed,
  fixFaces,
  upscale,
}: EditImageOptions) => {
  try {
    const cmd: string[] = [`aimg edit "${imageURL}" "${prompt}"`];

    if (steps) {
      cmd.push(`--steps=${steps}`);
    }

    if (promptStrength) {
      cmd.push(`--prompt-strength=${promptStrength}`);
    }

    if (negativePrompt) {
      cmd.push(`--negative-prompt="${negativePrompt}"`);
    }

    if (seed) {
      cmd.push(`--seed=${seed}`);
    }

    if (fixFaces) {
      cmd.push("--fix-faces");
    }

    if (upscale) {
      cmd.push("--upscale");
    }

    const { stdout } = await run(cmd.join(" "));

    const filePath = stdout.split(/ +/).pop()?.trim();
    const fileName = filePath?.split("/").pop()?.trim();
    const generatedPath = path.join("./outputs/generated", fileName!);
    return {
      filePath: generatedPath,
    };
  } catch (error) {
    console.error(error);
    return {
      filePath: null,
    };
  }
};
