## .env

- https://probot.github.io/docs/configuration/

추가적으로 `GITHUB_TOKEN`을 지원합니다.

`GITHUB_TOKEN`을 사용하면 `APP_ID`와 `PRIVATE_KEY[_PATH]`는 무시하게 됩니다.

## Github Event

Settings -> Developer settings -> GitHub Apps -> `<bot>` -> Edit -> Advanced

에서 이벤트 Payload를 확인할 수 있습니다.

## Slack

### Block kit

- https://app.slack.com/block-kit-builder

Block kit 빌더를 활용하면 전송될 메시지를 미리 확인할 수 있습니다.

```typescript
	const isSuccess = context.payload.workflow_run.conclusion === 'success';
	await slackClient.chat.postMessage({
		channel: 'XXXXXX',
		attachments: [
			{
				color: isSuccess ? '#36a64f' : '#d63232',
				blocks: [
					{
						type: 'section',
						text: {
							type: 'plain_text',
							text: `Github CD ${isSuccess ? '성공' : '실패'}했습니다.${
								isSuccess ? ':sunglasses:' : ':collision::collision::collision:'
							}`,
							emoji: true
						}
					}
				]
			}
		]
	});
```