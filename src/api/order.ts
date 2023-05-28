import { IList, IOrder } from '@/interface';
import request from '@/utils/request';

/**
 * 开始支付
 * @param total_amount 订单总金额，单位为元，精确到小数点后两位，取值范围为 [0.01,100000000]，金额不能为 0。
 * @param subject 订单标题。注意：不可使用特殊字符，如 /，=，& 等。
 * @param body 订单附加信息。如果请求时传递了该参数，将在异步通知、对账单中原样返回，同时会在商户和用户的pc账单详情中作为交易描述展示
 * @returns
 */
export function fetchAliPay(data: {
  goodsId: number;
  liveRoomId: number;
  money?: string;
}) {
  return request.instance({
    url: '/order/pay',
    method: 'post',
    data,
  });
}

/**
 * 查询是否支付
 * @param out_trade_no 订单支付时传入的商户订单号
 * @returns
 */
export function fetchAliPayStatus(params: { out_trade_no: string }) {
  return request.instance({
    url: '/order/pay_status',
    method: 'get',
    params,
  });
}
/**
 * 支付列表（支付中和已支付）
 * @param out_trade_no 订单支付时传入的商户订单号
 * @returns
 */
export function fetchOrderList(params: IList<IOrder>) {
  return request.instance({
    url: '/order/order_list',
    method: 'get',
    params,
  });
}
