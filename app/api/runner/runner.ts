import { createRunner, type RunConfig } from "@google-labs/breadboard/harness";

let userRunnerMap = {};

export const QUIZ_CONFIG = {};
export const FLASHCARDS_CONFIG = {};

export async function getCreateRunner(userid, config) {
  if (userid in userRunnerMap) {
    return userRunnerMap[userid];
  }

  let runner = createRunner(config);
  userRunnerMap[userid] = runner;
  return runner;
}

export async function startQuiz(userid, input) {
  let runner = await getCreateRunner(userid, QUIZ_CONFIG);
  runner.run({ input: input });
}
