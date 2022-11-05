<template>
	<view class="cardDetail-Tem" style='margin-bottom: 10px;'>
		<view class="header">
			<view class="left">{{title||'标题'}}</view>
			<view class="right">
				<u-tag size='mini' :text="type||''" type="warning" icon="tags-fill"></u-tag>
			</view>
		</view>
		<!-- 内容区域 -->
		<view class="content">
			<!-- tag标签: 技术栈 -->
			<view class="tags">
				<template v-for="(item,i) in tags">
					<u-tag :key="i" class='tags-item' :text="item" plain size="mini" :type="createRandomType()"></u-tag>
				</template>
			</view>
			<!-- 功能描述 -->
			<template v-if="descripts.length<=0">
				<u-empty text="这个作者很聪明,没有写任何描述~" icon="http://cdn.uviewui.com/uview/empty/car.png">
				</u-empty>
			</template>
			<template v-else>
				<view @click="readText(descripts)" class="deScript">
					<template v-for="(item,i) in descripts.slice(0,3)">
						<view :key="i" class="deScipt-item">
							<u--text lines='1' bold :text="item.title"></u--text>
							<u--text lines='2' :text="item.text"></u--text>
							<u-line style='margin:10rpx 0'></u-line>
						</view>
					</template>
					<u--text v-if="descripts.length>3" lines='1' text="查看更多"></u--text>
				</view>
			</template>
			<!-- 时间段 -->
			<view style="color:#1ac2c4;text-align: right;font-size: 10px;">
				{{time?$u.timeFormat(time[0], 'yyyy年mm月dd日'):$u.timeFormat(Date.now(), 'yyyy年mm月dd日')}}
				-
				{{time?$u.timeFormat(time[1], 'yyyy年mm月dd日'):$u.timeFormat(Date.now(), 'yyyy年mm月dd日')}}
			</view>
		</view>
		<!-- 弹出层 -->
		<u-popup safeAreaInsetBottom :show="popupShow" @close="popupShow=false" :closeable='true'>
			<scroll-view style="height: 50vh;padding: 20px;box-sizing: border-box;" scroll-y="true">
				<template v-for="(item,i) in popupTexts">
					<view :key="i" class="popup-item">
						<u--text bold :text="item.title"></u--text>
						<u--text :text="item.text"></u--text>
						<u-line style='margin:10rpx 0'></u-line>
					</view>
				</template>
			</scroll-view>
		</u-popup>
	</view>
</template>

<script>
	/* tool */
	import { createRandomNum, isNull } from '@/utils/tool.js'
	const randomTypeNum = createRandomNum(0, 3); // 返回一个函数,函数可以创建一个随机不同上一个数的数字

	export default {
		name: 'cardDetail',
		props: {
			title: {
				type: String,
				default: () => '标题'
			},
			time: {
				type: [Array, String],
				validator(value) {
					if (typeof value === 'string') {
						return value.split('至')
					} else {
						return value
					}
				},
				default: () => [(new Date('2000/01/01')) * 1, Date.now()]
			},
			tags: {
				type: Array,
				default: () => []
			},
			descripts: {
				type: Array,
				default: () => []
			},
			type: { type: String }
		},
		data() {
			return {
				//是否显示弹出层
				popupShow: false,
				popupTexts: []
			}
		},
		created() {

		},
		methods: {
			// 查看描述的完整内容
			readText(descripts) {
				this.popupTexts = descripts;
				this.popupShow = true;
			},
			// 生成一个随机类型
			createRandomType() {
				const num = randomTypeNum();
				return ['success', 'info', 'warning', 'error'][isNull(num) ? 1 : num]
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cardDetail-Tem {
		color: #000000d9;
		border: 1px solid rgba(0, 0, 0, .1);
		background-color: white;
		border-radius: 3px;

		.header {
			padding: 10rpx 20rpx;
			display: flex;
			justify-content: space-between;
			background-color: #cee6ff;

			.left {
				color: #1a2b3b;
				font-weight: 700;
			}

			.right {
				color: #0170fe;
			}

		}

		.content {
			padding: 10rpx 20rpx;
			background-color: #e6f1ff;

			.tags {
				padding: 20rpx 0rpx;
				display: flex;
				flex-wrap: wrap;

				.tags-item {
					/* Fix :flex布局中 通过margin解决换行不对齐 */
					margin: 10rpx;
					padding: 3px;
				}
			}

			.deScript {
				padding: 20rpx 0rpx;
			}
		}
	}
</style>
