/**
 * 充值提现查询
 * 交易明细查询
 */
function queryList(page){
	var status;
	var type;
	var date ;
	var amountTD;
	var loan;//备注
	var loanName;
	//设置页码
	$("#page").val(page);
	
	$.ajax({
		type : "POST",
		url : "queryDeal.htm",//../../ssl/account/queryDeal.htm
		data : $('#centerForm').serialize(),
		dataType : "json",
		async : false,
		success : function(data) {
			
			if (data.deals.result == undefined || data.deals.result == "") {
				$("#uls").html("<li style='text-align:center;'><p style='font-size:18px;'>暂无交易记录~</p></li>");
				$("#detailPages").html("");
				var month=$("#month").val();
				if(month==-6||month==10){//设置时间选择处数量
					$("#three span").text(data.deals.total);
				}else{
					$("#threeAgo span").text(data.deals.total);
				}
				if(month==10){
					$("#threeAgo span").text(data.threeAgo);
					$("#month").val(-6);
				}
			} else {
				var month=$("#month").val();
				if(month==-6||month==10){//设置时间选择处数量
					$("#three span").text(data.deals.total);
				}else{
					$("#threeAgo span").text(data.deals.total);
				}
				if(month==10){
					$("#threeAgo span").text(data.threeAgo);
					$("#month").val(-6);
				}
				//加载分页
				if(page==1){
					laypage({
					    cont: 'detailPages',
					    pages: data.deals.pageCount,//总页数
					    skin: '#ED5345',	
					    prev:"<",//上一页 
					    next:">",//下一页
					    jump: function(obj,first){//点击页码出发的事件
					    	if(first!=true){//是否首次进入页面
					    		var currentPage = obj.curr;//获取点击的页码
					    		queryList(currentPage);
					    	}
					    }
					});
				}
				$("#uls").html("");
				if(data.deals.pageCount==1){
					$("#detailPages").html("");
				}
				$.each(data.deals.result, function(idx, deal) {
					/*loan = "流水号:" + deal.requestNo.substring(0,5)+"...";*/
					if(deal.dealType==1){
						type = "充值";
						loan="账号充值";
					}else if(deal.dealType==2){
						type = "提现";
						loan="账号提现";
					}else if(deal.dealType==22){
						type = "付费提现";
						loan="账号提现";
					}else if(deal.dealType==24){
						type = "提现返回";
						loan="提现失败金额返回";
					}else if(deal.dealType==3){
						if(deal.loanName.length>13)
							loanName = deal.loanName.substring(0,13) + "...";
						else
							loanName = deal.loanName ;
						loan = "<a style='color: #006ba9;' title='"+deal.loanName+"' href='../../invest/loanDetail.htm?id="+deal.loanId + "'>" + loanName + "</a>";
						
						if(deal.bidStatus==2 || deal.bidStatus==5){
							type = "出借";
						}else if(deal.bidStatus==1){
							type = "冻结";
						}else if(deal.bidStatus==3 ){
							type = "冻结";
						} else if(deal.bidStatus==4){
							type = "冻结";
						}else if(deal.bidStatus==-2){
							type = "取消投标";
						}
					}
					else if(deal.dealType==5){
						if(deal.loanName.length>13)
							loanName = deal.loanName.substring(0,13) + "...";
						else
							loanName = deal.loanName ;
						loan = "<a style='color: #006ba9;' title='"+deal.loanName+"' href='../../invest/loanDetail.htm?id="+deal.loanId + "'>" + loanName + "</a>";
						
						type = "冻结";
					}else if(deal.dealType==4 || deal.dealType==8 || deal.dealType==17 || deal.dealType==18 || deal.dealType==19){
						if(deal.loanName.length>13)
							loanName = deal.loanName.substring(0,13) + "...";
						else
							loanName = deal.loanName ;
						loan = "<a style='color: #006ba9;' title='"+deal.loanName+"' href='../../invest/loanDetail.htm?id="+deal.loanId + "'>" + loanName + "</a>";
						
						if(deal.dealType==4)
							type = "还款";
						else if(deal.dealType==8){
							type = "解冻";
						}
						else if(deal.dealType==17)
							type="原债权本金";
						else if(deal.dealType==18)
							type="原债权回报";
						else if(deal.dealType==19)
							type="受让回报";
					}else if(deal.dealType==9){
						if(deal.loanName.length>13)
							loanName = deal.loanName.substring(0,13) + "...";
						else
							loanName = deal.loanName ;
						loan = "<a style='color: #006ba9;' title='"+deal.loanName+"' href='../../invest/loanDetail.htm?id="+deal.loanId + "'>" + loanName + "</a>";
						type = "放款";
					}else if(deal.dealType==11){
						type = "红包";
						if(deal.note.length>13){
							loan=deal.note.substring(0,13)+"...";
						}else{
							loan=deal.note;
							if(loan=='-'){
								loan = "流水号:" + deal.requestNo.substring(0,13)+"...";
							}
						}
					}else if(deal.dealType==10 ||deal.dealType==12 || deal.dealType==13 || deal.dealType==15 || deal.dealType==16 || deal.dealType==20){
						if(deal.loanName.length>13)
							loanName = deal.loanName.substring(0,13) + "...";
						else
							loanName = deal.loanName ;
						loan = "<a style='color: #006ba9;' title='"+deal.loanName+"' href='../../invest/loanDetail.htm?id="+deal.loanId + "'>" + loanName + "</a>";
						
						if(deal.dealType==10)
							type = "收款";
						else if(deal.dealType==12)
							type = "回报入账";
						else if(deal.dealType==13)
							type = "收到本金";
						else if(deal.dealType==15)
							type="债权转让服务费";
						else if(deal.dealType==16)
							type="债权转让折价费";
						else if(deal.dealType==20)
							type="扣回已收回报";
						
					}else{
						type="其他";
						loan = "流水号:" + deal.requestNo.substring(0,13)+"...";
					}
					if((deal.recordStatus==1|| (deal.recordStatus==2 && deal.dealType!=2 && deal.dealType!=22) ) )  {
						status = "成功";
						if((deal.dealType==3 && (deal.bidStatus!=2 && deal.bidStatus!=5) ) || deal.dealType==5){
							amountTD="<span style='color:#01a23d'>-"+fmoney(deal.amount,2)+"</span>";
							if(deal.dealType==11){
								amountTD="<span style='color:#01a23d'>-"+fmoney(deal.cariAmount,2)+"</span>";
							}
						}
						else{
							if(deal.inoutType==1 ){
								amountTD="<span style='color:#c00'>+"+fmoney(deal.amount,2)+"</span>";
								if(deal.dealType==11){
									amountTD="<span style='color:#c00'>+"+fmoney(deal.cariAmount,2)+"</span>";
								}
							}else{
								amountTD="<span style='color:#01a23d'>-"+fmoney(deal.amount,2)+"</span>";
								if(deal.dealType==11){
									amountTD="<span style='color:#01a23d'>-"+fmoney(deal.cariAmount,2)+"</span>";
								}
							}
							
						}
					}
					else if(deal.recordStatus==0){
						amountTD="<span>"+fmoney(deal.amount,2)+"</span>";
						if(deal.dealType==11){
							amountTD="<span>"+fmoney(deal.cariAmount,2)+"</span>";
						}
						status = "失败";
					}else if(deal.recordStatus==-2){
						amountTD="<span>"+fmoney(deal.amount,2)+"</span>";
						if(deal.dealType==11){
							amountTD="<span style='color:#c00'>"+fmoney(deal.cariAmount,2)+"</span>";
						}
						status = "兑换中";
					}else if(deal.dealType==2 || deal.dealType==22){
						amountTD="<span style='color:#01a23d'>-"+fmoney(deal.amount,2)+"</span>";
						status ="成功"
					}
					date = formatDate(new Date(deal.time));
					var temp=loan;
					var content="";
					if(loan.indexOf("</a>")>-1){
						content ="<li><p>"+amountTD+"<span >"+type+"</span>"+"<span style='color:#555' title='"+deal.time.substring(0,19)+"'>"+deal.time.substring(0,10)+"</span>"+"<span>"+status+"</span>"+"<span title='"+loanName+"'>"+loan+"</span></p></li>";
					}else{
						content ="<li><p>"+amountTD+"<span >"+type+"</span>"+"<span style='color:#555' title='"+deal.time.substring(0,19)+"'>"+deal.time.substring(0,10)+"</span>"+"<span>"+status+"</span>"+"<span title='"+loan+"'>"+loan+"</span></p></li>";
						
					}
					$("#uls").append(content);    
				});
				$("#page").val(data.deals.page);
				$("#rows").val(data.deals.rows);
			}
		}
	});
}
	/**
	 * 充值提现查询
	 * 交易明细查询
	 */
	function queryPrint(){
		if($("#dataMsg").length == 1){
			jAlert("您目前暂无可导出的信息","普惠理财提示您：");
		}else{
			document.centerForm.action = "../../ssl/account/queryDealPrint.htm"
			centerForm.submit();
		}
}
	
	
	/**
	 * 微信端充值提现查询
	 * 交易明细查询
	 */
	function queryListWeixin(){
		var status;
		var type;
		var date;
		var amountTD;
		var trStyle;
		var loan;
		var loanName;
		$.ajax({
			type : "POST",
			url : "../../ssl/account/queryFundWeixin.htm",
			data : $('#centerForm').serialize(),
			dataType : "json",
			async : false,
			success : function(data) {
				if (data.deals.result == undefined || data.deals.result == "") {
					//$("#tbody").html("<tr><td colspan='5'><dt colspan='9' style='text-align: center'><h4 id='dataMsg''>没有更多数据</h4></dt></td></tr>");
					$("#addTag").html("<input id='loadData' value='没有更多数据'/>");
					//$("#pageInfo").attr("style","display:none");
				} else {
					//$("#pageInfo").attr("style","display:block");
					//$("#tbody").html("");
					
					$.each(data.deals.result, function(idx, deal) {
						//loan = "流水号:" + deal.requestNo;
						if(deal.dealType==1)
							type = "充值";
						else if(deal.dealType==2)
							type = "提现";
						else if(deal.dealType==22)
							type = "付费提现";
						else if(deal.dealType==3)
						{
							if(deal.bidStatus==2 || deal.bidStatus==5){
								type = "出借"
//								if(deal.loanName.length>13)
//									loanName = deal.loanName.substring(0,18) + "...";
//								else
//									loanName = deal.loanName ;
//								loan = "<a style='color: #cc0000;'  href='../../invest/loanDetail.htm?id="+deal.loanId + "'>" + loanName + "</a>&nbsp;&nbsp;<br>流水号:" + deal.requestNo;
							}else if(deal.bidStatus==1){
								type = "冻结";
								loanName="";
							}else if(deal.bidStatus==3 ){
								type = "冻结";
//								loan = "<a style='color: #cc0000;'  href='../../invest/loanDetail.htm?id="+deal.loanId + "'>" + loanName + "</a>&nbsp;&nbsp;<br>流水号:" + deal.requestNo;
							} else if(deal.bidStatus==4){
								type = "冻结";
//								loanName="";
							}
						}
						else if(deal.dealType==5)
							type = "冻结";
						else if(deal.dealType==4 || deal.dealType==8 || deal.dealType==17 || deal.dealType==18 || deal.dealType==19){
							if(deal.dealType==4)
								type = "还款";
							else if(deal.dealType==8){
								type = "解冻";
								loanName="";
							}
							else if(deal.dealType==17)
								type="原债权本金";
							else if(deal.dealType==18)
								type="原债权回报";
							else if(deal.dealType==19)
								type="受让回报";
//							if(deal.loanName.length>13)
//								loanName = deal.loanName.substring(0,18) + "...";
//							else
//								loanName = deal.loanName ;
							
//							if(loanName=="")
//								loan = "<a style='color: #cc0000;'  href='../../invest/loanDetail.htm?id="+deal.loanId + "'>" + loanName + "</a>&nbsp;&nbsp;<br>流水号:" + deal.requestNo;
//							else
//								loan = "<a style='color: #cc0000;'  href='../../invest/loanDetail.htm?id="+deal.loanId + "'>" + loanName + "</a>&nbsp;&nbsp;<br>流水号:" + deal.requestNo;
						}else if(deal.dealType==9)
							type = "放款";
						else if(deal.dealType==11)
							type = "红包";
						else if(deal.dealType==10 ||deal.dealType==12 || deal.dealType==13 || deal.dealType==15 || deal.dealType==16 || deal.dealType==20){
							if(deal.dealType==10)
								type = "收款";
							else if(deal.dealType==12)
								type = "回报入账";
							else if(deal.dealType==13)
								type = "收到本金";
							else if(deal.dealType==15)
								type="债权转让服务费";
							else if(deal.dealType==16)
								type="债权转让折价费";
							else if(deal.dealType==20)
								type="扣回已收回报";
//							if(deal.loanName.length>13)
//								loanName = deal.loanName.substring(0,18) + "...";
//							else
//								loanName = deal.loanName ;
//							loan = "<a style='color: #cc0000;' href='../../invest/loanDetail.htm?id="+deal.loanId + "'>" + loanName+ "</a>&nbsp;&nbsp;<br>流水号:" + deal.requestNo;
						}else
							type="其他";
						if((deal.recordStatus==1|| (deal.recordStatus==2 && deal.dealType!=2 && deal.dealType!=22) ) )  {
							status = "成功";
							if((deal.dealType==3 && (deal.bidStatus!=2 && deal.bidStatus!=5) ) || deal.dealType==5 || deal.dealType==8 ){
								amountTD = "<td class='t_right'><span >" + fmoney(deal.amount,2) + "</span></td>"; 
							}
							else{
								if(deal.inoutType==1 )
									amountTD = "<td class='t_right'><span class='font_red'>+" + fmoney(deal.amount,2) + "</span></td>"; 
								else
									amountTD = "<td class='t_right'><span class='font_green'>-" + fmoney(deal.amount,2) + "</span></td>"; 
							}
						}
						else if(deal.recordStatus==0){
							amountTD = "<td class='t_right'>" + fmoney(deal.amount,2) + "</td>"; 
							status = "失败";
						}else if(deal.dealType==2 || deal.dealType==22){
							amountTD="<span style='color:#01a23d'>-"+fmoney(deal.amount,2)+"</span>";
							status = "成功";
						}
						
						date = formatDate(new Date(deal.time));
						
						if(idx%2==0)
							trStyle = "<tr style='background:#f9f9f9;'>";
						else
							trStyle = "<tr>";
						//将日期和时间分开,分行显示
						var dateTime = deal.time;
						var date = dateTime.substr(0, 10);
						var time = dateTime.substr(11, 8);
						var content = trStyle +"<td>"+ date +"<br>"+ time + "</td><td>"+type + "</td>" + amountTD + "<td>"+"</td></tr>"
						if(idx==0)
							$("#tbody").append(content);    
						else
							$("#tbody").append(content);
					});
					$("#pageCount").val(data.deals.pageCount);
					$("#page").val(data.deals.page + 1);
					$("#rows").val(data.deals.rows);
				}
			}
		});
		var page = $("#page").val()-1;
		var pageCount = $("#pageCount").val();
		if(parseInt(pageCount)<=parseInt(page)){
//			$("#loadData").hide();
//			$("#noData").show();
			$("#addTag").html("<span id='promtText'>没有更多数据</span>");
		}else{
			$("#addTag").html("<a id='loadData' onclick='queryListWeixin()' ><span id='promtText'>点击加载更多</span></a>");
		}
	}
	
	/**
	*充值提现页面查询充值、提现记录
	*/
	function queryRechargeWithdrawList(page){
		var status=$("#status").val();
		var type;
		var date ;
		var amountTD;
		var loan;//备注
		var loanName;
		var loanTitle;
		//var currentPage=1;
		var title="<li class='fless fless2'><p><i>交易金额</i><i>交易类型</i><i>交易时间</i><i>状态</i><i>备注</i></p></li>";

		$("#page").val(page);//设置页码
		//$("#status").val(status);//设置查询状态
		
		$.ajax({
			type : "POST",
			url : "../../ssl/account/queryDeal.htm",//../../ssl/account/queryDeal.htm
			data : $('#centerForm').serialize(),
			dataType : "json",
			async : false,
			success : function(data) {
				if (data.deals.result == undefined || data.deals.result == "") {
					var strNoRecoderTips="暂无充值提现记录~";
					if(status==1){
						var strNoRecoderTips="暂无充值记录~";
						$("#detailPages").html("");
					}else if(status==2){
						var strNoRecoderTips="暂无提现记录~";
						$("#detailPages").html("");
					}
					$("#uls").html(title+"<li style='text-align:center;padding-top:10px'><p>"+strNoRecoderTips+"</p></li>");
				} else {
					//if(data.totalRecords>10){
						//加载分页
						if (page == 1) {
							laypage({
								cont : 'detailPages',
								pages : data.deals.pageCount, //总页数
								skin : '#ED5345',
								prev : "<", //上一页
								next : ">", //下一页
								jump : function (obj, first) { //点击页码出发的事件
									if (first != true) { //是否首次进入页面
										//currentPage = obj.curr; //获取点击的页码
										queryRechargeWithdrawList(obj.curr);
									}
								}
							});
						}
						//总页数为1时，页数都隐藏
						if(data.deals.pageCount == 1){
							$("#detailPages").html("");
						}
					//}
					$("#uls").html("");
					$("#uls").append(title);
					$.each(data.deals.result, function (idx, deal) {
						loan = "流水号:" + deal.requestNo.substring(0, 5) + "...";
						loanTitle="流水号:" + deal.requestNo;
						var amount;
					
						//判断交易状态
						if ((deal.recordStatus == 1 || (deal.recordStatus == 2 && deal.dealType != 2 && deal.dealType != 22))) {
							status = "成功";
							if ((deal.dealType == 3 && (deal.bidStatus != 2 && deal.bidStatus != 5)) || deal.dealType == 5 || deal.dealType == 8) {
								amountTD =fmoney(deal.amount, 2);
							} else {
								if (deal.inoutType == 1)
									amountTD = fmoney(deal.amount, 2);
								else
									amountTD =fmoney(deal.amount, 2);
							}
						} else if (deal.recordStatus == 0) {
							amountTD =fmoney(deal.amount, 2);
							status = "失败";
						}else if(deal.dealType==2 || deal.dealType==22){
							amountTD = fmoney(deal.amount,2);
							status="成功";
						}
						
						//判断交易类型（充值、提现）
						if (deal.dealType == 1){
							amount="<i style='color:#CC0000'>+"+amountTD+"</i>";
							type = "充值";
						}
						else if (deal.dealType == 2){
							amount="<i style='color:#01A25B'>-"+amountTD+"</i>";
							type = "提现";
						}
						else if (deal.dealType == 22){
							amount="<i style='color:#01A25B'>-"+amountTD+"</i>";
							type = "付费提现"; 
						}
						else
							type = "其他";
						
						var dateTime = deal.time;
						var date = dateTime.substr(0, 10);
						var dateTitle=dateTime.substr(0,19);
						//var dateTitle=formatDate(new Date(dateTime)).substring(0,19);
						//alert(dateTitle);
						//var dateTitle="1234567891011121314151617181920";
						var content = "<li class='fless3'><p>" + amount + "<i>" + type + "</i><i class='is' title='"+dateTime+"'>" + date + "</i><i>" + status + "</i><i title="+loanTitle+">"+ loan + "</i></p></li>";
						$("#uls").append(content);
					});
					$("#page").val(data.deals.page);
					$("#rows").val(data.deals.rows);
				}

			}
		});
	}