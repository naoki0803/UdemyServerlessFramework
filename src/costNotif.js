const { IncomingWebhook } = require('@slack/webhook');
const AWS = require("aws-sdk");
const dayjs = require('dayjs')

// SlackのWebhook URLを環境変数から取得
const webhookUrl = process.env.SLACK_WEBHOOK_URL;
const webhook = new IncomingWebhook(webhookUrl);

// AWS Cost Explorerの設定
const date = dayjs();
const startDate = date.format("YYYY-MM-01");
const endDate = date.add(1, "months").format("YYYY-MM-01");
const ce = new AWS.CostExplorer({ region: 'us-east-1' });
const params = {
  TimePeriod: {
    Start: startDate,
    End: endDate
  },
  Granularity: 'MONTHLY',
  Metrics: ['UnblendedCost']
};

// Lambdaハンドラー関数
async function costNotif() {
  const costAndUsage = await ce.getCostAndUsage(params).promise();
  const useCost = costAndUsage.ResultsByTime[0].Total.UnblendedCost.Amount;
  await webhook.send({
    text: `今月の使用料は: ${useCost} USDです`
  });
}

// 関数をエクスポート
module.exports.handler = costNotif;
