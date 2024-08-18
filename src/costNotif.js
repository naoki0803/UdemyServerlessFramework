/**
 * ファイル名: costNotif.js
 * 
 * 概要: Lambda関数として実行されるロジック
 * 
 * 詳細:
 * 1. LambdaのEventBridgeにより毎朝9時に実行される
 * 2. 当月1日から当月末日までの金額をaws-sdkの記述に従いce.getCostAndUsageで取得する
 * 3. SlackWebhookを利用して2で取得した金額をSlackに通知する
 * * 
 * 前提条件:
 * - serverlessFrameworkを導入している
 * - SlackのWebhookURLを取得している
 * - serverless.ymlにlambdaへdeployする内容が記述されている
 * 
 * 作成者: 00083ns
 * 作成日: 2024/08/19
 * 更新者: 
 * 更新日: 
 */


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
