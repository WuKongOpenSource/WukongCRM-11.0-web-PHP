export const invoiceHeaderFields = [{
  label: '发票申请编号',
  width: '120px',
  prop: 'invoice_apple_number'
}, {
  label: '客户名称',
  width: '120px',
  prop: 'customer_name'
}, {
  label: '合同编号',
  width: '120px',
  prop: 'contract_number'
}, {
  label: '合同金额',
  width: '90px',
  prop: 'contract_money'
}, {
  label: '开票金额（元）',
  width: '120px',
  prop: 'invoice_money'
}, {
  label: '开票日期',
  width: '120px',
  prop: 'invoice_date'
}, {
  label: '实际开票日期',
  width: '120px',
  prop: 'real_invoice_date'
}, {
  label: '开票类型',
  width: '120px',
  prop: 'invoice_type'
}, {
  label: '发票号码',
  width: '90px',
  prop: 'invoice_number'
}, {
  label: '物流单号',
  width: '90px',
  prop: 'logistics_number'
}, {
  label: '负责人',
  width: '90px',
  prop: 'owner_user_name'
}, {
  label: '审核状态',
  width: '90px',
  prop: 'check_status'
}]

// 筛选字段
export const invoiceFilterFields = [{
  form_type: 'text',
  field: 'invoice_number',
  fieldName: 'invoiceNumber',
  name: '发票号码'
}, {
  form_type: 'date',
  field: 'real_invoice_date',
  fieldName: 'realInvoiceDate',
  name: '实际开票日期'
},
// {
//   form_type: 'text',
//   field: 'name',
//   fieldName: 'customerName',
//   name: '客户姓名'
// },
{
  form_type: 'text',
  field: 'logistics_number',
  fieldName: 'logisticsNumber',
  name: '物流单号'
}, {
  form_type: 'select',
  field: 'invoice_status',
  fieldName: 'invoiceStatus',
  name: '开票状态',
  setting: ['未开票', '已开票']

  // setting: [{
  //   name: '未开票',
  //   value: 0
  // }, {
  //   name: '已开票',
  //   value: 1
  // }]
}, {
  form_type: 'check_status',
  field: 'check_status',
  fieldName: 'check_status',
  name: '审核状态',
  setting: ['待审核', '审核中', '审核通过', '审核失败', '已撤回']
  // setting: [
  //   {
  //     name: '待审核',
  //     value: 0
  //   }, {
  //     name: '通过',
  //     value: 2
  //   }, {
  //     name: '拒绝',
  //     value: 3
  //   }, {
  //     name: '审核中',
  //     value: 1
  //   }, {
  //     name: '撤回',
  //     value: 4
  //   }
  // ]
}, {
  form_type: 'user',
  field: 'owner_user_id',
  fieldName: 'ownerUserId',
  name: '负责人'
}]
