export const SCENARIOS: Record<string, string> = {
  coffee_shop: `场景：用户在咖啡店点单。帮助他们学会点饮品、描述偏好（冰/热、甜度、大小）、付款。`,
  taxi: `场景：用户在打车。帮助他们告诉司机目的地、描述路线、闲聊天气和交通。`,
  restaurant: `场景：用户在中餐馆吃饭。帮助他们看菜单、点菜、描述口味偏好、买单。`,
  hospital: `场景：用户在医院/诊所。帮助他们描述症状、理解医生的问题、表达疼痛程度和位置。`,
  market: `场景：用户在菜市场/超市购物。帮助他们询问价格、砍价、描述想要的数量。`,
  business: `场景：用户在商务场合。帮助他们自我介绍、交换名片、敬酒、礼貌地拒绝邀请。`,
  social: `场景：用户在朋友聚会或社交场合。帮助他们聊兴趣爱好、分享周末计划、开玩笑。`,
  family: `场景：用户和中国朋友/家人通话。帮助他们问候长辈、描述自己的工作和生活。`,
  free: `自由对话模式。根据用户想聊的任何话题自然对话。`,
};

export function getScenarioPrompt(scenario: string): string {
  return SCENARIOS[scenario] || SCENARIOS.free;
}
