<template>
	<view class="Circle__" @touchstart="start" @touchmove="move" @touchend="end" :style="{
			background: `#fff url(${bgImg}) top/100% ${imgHeight} no-repeat`,
			minHeight: imgHeight
		}">
		<!-- 加载动画 -->
		<view :class="loadingMoveAni" class="loadingAnimation"></view>
		<!-- 导航栏 -->
		<uni-nav-bar @clickRight="navRightEvent" color="#fff" backgroundColor="rgba(40, 44, 53,0)" rightIcon="camera"
			title="说说" :border="false" :fixed="true"></uni-nav-bar>
		<!-- 遮罩 -->
		<u-action-sheet @select="updateBG" @close="sheetShow = false" cancelText="取消" :closeOnClickOverlay="true"
			:closeOnClickAction="true" :safeAreaInsetBottom="true" :actions="[{ name: '修改背景' }]" :show="sheetShow">
		</u-action-sheet>
		<view class="mask" @click="sheetShow = true" :style="{
				height: maskHeight
			}"></view>
		<!-- 内容区域 -->
		<view class="content" :class="animationFwei" :style="{
				position: 'relative',
				top: contentTop,
				minHeight: `calc(100vh - var(--window-bottom) - ${navHeight} - ${maskHeight} - ${iStatusBarHeight})`
			}">
			<!-- 头像 -->
			<u-action-sheet @select="updateProfile" @close="profileSheet = false" cancelText="取消"
				:closeOnClickOverlay="true" :closeOnClickAction="true" :safeAreaInsetBottom="true"
				:actions="[{ name: '修改头像' }]" :show="profileSheet"></u-action-sheet>
			<view class="profile">
				<u--image @click='profileSheet=true' :showLoading="true" :src="profile" width="100%" height="100%">
				</u--image>
			</view>
			<!-- 实际内容 -->
			<view class="content-bd">
				<circt @delet='deletEvent' :dataList='cirDataList' :profile='profile'></circt>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 1. 朋友圈背景图当作页面背景,固定再上方,背景表层需要一层透明遮罩,用来占位
	 * 2. 手指滑动刷新时,改变内容区的位置,让其往下移动
	 * **/
	import bgImg from '@/static/image/bg.jpg'
	/* api */
	import { userInfoApi, updateBGApi, updateProfileApi, readCirDataApi } from '@/api/circle.js'
	/* 组件 */
	import circt from '@/components/cirContent.vue'

	let scrolltopNum = 0 // 页面距离顶部的距离\
	let lastY = 0

	export default {
		name: 'CircleIndex',
		components: { circt },
		data() {
			return {
				profileSheet: false, //菜单
				sheetShow: false, //菜单
				loadingMoveAni: '', //loading移动的动画
				animationFwei: '', //内容区域复位动画
				profile: '', // 头像
				contentTop: '0px', //内容区top位置
				iStatusBarHeight: 0, // 状态栏的高度
				navHeight: '44px', // 导航栏的高度,这个组件的高度官方有说
				bgImg, //背景图片
				imgHeight: '300px', // 背景高度
				maskHeight: '200px', // 遮罩高度
				isRefresh: true, // 是否可以继续刷新用户信息
				cirDataList: [], //说说的数据
			}
		},
		onShow() {
			this.getCirInfo()
		},
		methods: {
			dataList() {
				this.getUserInfo(true)
			},
			//某条说说被删除了
			deletEvent() {
				this.getCirInfo()
			},
			//更新头像
			updateProfile() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: async res => {
						const { profile } = await updateProfileApi(res.tempFilePaths[0])
						profile && (this.profile = this.$baseURL + profile);
					}
				})
			},
			//更新背景
			updateBG() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: async res => {
						let { bg } = await updateBGApi(res.tempFilePaths[0])
						bg && (this.bgImg = this.$baseURL + bg)
					}
				})
			},
			// 刷新用户信息
			async refreshInfo() {
				if (!this.isRefresh) return
				this.isRefresh = false
				try {
					await this.getUserInfo()
				} catch (e) {
					//TODO handle the exception
				} finally {
					// 刷新完恢复loading
					if (this.loadingMoveAni) {
						setTimeout(() => {
							this.loadingMoveAni = 'loadingTop'
						}, 500) // 给一点延迟
					}
					this.isRefresh = true
				}
			},
			// 获取说说内容
			async getCirInfo() {
				try {
					let { data } = await readCirDataApi()
					data = data.map(v => {
						v.urls = v.urls.map(item => this.$baseURL + item)
						return v
					})
					this.cirDataList = data
				} catch (e) {
					//TODO handle the exception
				}
			},
			// 获取用户信息
			async getUserInfo(isLoading = false) {
				try {
					let { bg, profile } = await userInfoApi(isLoading)
					bg && (this.bgImg = this.$baseURL + bg)
					profile && (this.profile = this.$baseURL + profile)
					console.log(this.$baseURL)
				} catch (e) {
					//TODO handle the exception
				}
			},
			// 手指按住
			start(e) {
				this.animationFwei = '' // 每次开始将动画清除掉
			},
			// 手指滑动中
			move(e) {
				// 通过限制后才能修改top值
				if (this.isBan()) {
					const setNum = 0.5 // y轴滑动多少算一次
					// TODO:如果移动了一定距离就开启loading动画,然后刷新用户信息
					if (e.changedTouches[0]['clientY'] - lastY > 10) {
						this.refreshInfo()
						this.loadingMoveAni = 'loadingBottom'
					}
					// 变化不能太频繁
					if (e.changedTouches[0]['clientY'] - lastY > setNum) {
						const stup = 5 // 每次移动2
						// 如果是上移动也要复位
						if (lastY < e.changedTouches[0]['clientY']) {
							lastY = e.changedTouches[0]['clientY']
							this.contentTop = uni.$u.getPx(this.contentTop) + stup + 'px'
						} else {
							this.fuWeiContent()
						}
					}
				}
			},
			// 手指松开
			end(e) {
				this.fuWeiContent()
			},
			// 修改top值前的限制
			isBan() {
				try {
					//1. scrolltop为0
					if (scrolltopNum <= 0) {
						// 2. 状态栏&导航栏&遮罩&跟top值不能大于图片高
						const H = uni.$u.getPx(this.iStatusBarHeight) + uni.$u.getPx(this.navHeight) + uni.$u.getPx(this
							.maskHeight) + uni.$u.getPx(this.contentTop)
						if (H <= uni.$u.getPx(this.imgHeight)) {
							return true
						} else {
							return false
						}
					} else {
						// Fix:不能在第一层复位,太频繁,也没必要
						return false
					}
				} catch (e) {
					this.fuWeiContent()
					return false
					//TODO handle the exception
				}
			},
			// 复位内容区
			fuWeiContent() {
				this.animationFwei = 'fuwei' // 复位前添加动画class
				lastY = 0
				this.contentTop = '0px'
			},
			// 导航栏右侧图标点击事件
			navRightEvent() {
				uni.navigateTo({ url: '/pages/cirFabu/cirFabu' });
			}
		},
		onLoad() {
			this.dataList()
			this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px'
		},
		onPageScroll(e) {
			scrolltopNum = e.scrollTop

		}
	}
</script>

<style lang="scss" scoped>
	.Circle__ {
		padding-top: var(--status-bar-height);

		.loadingAnimation {
			position: absolute;
			left: 50rpx;
			top: -90rpx;
			width: 88rpx;
			height: 88rpx;
			border-radius: 50%;
			background: url('../../static/image/loading.gif') center/120% 120% no-repeat;
			background-color: teal;
		}

		.loadingBottom {
			top: 90rpx !important;
			opacity: 1;
			transition: all 0.2s ease-in-out;
		}

		.loadingTop {
			top: -90rpx !important;
			opacity: 0;
			transition: all 0.2s ease-in;
		}

		.content {
			background-color: #fff;

			.content-bd {
				padding: 155rpx 30rpx 50rpx 30rpx;
			}

			.profile {
				width: 150rpx;
				height: 150rpx;
				position: absolute;
				right: 50rpx;
				top: 0%;
				transform: translateY(-70%);
				border-radius: 20rpx;
				background-color: gray;
				overflow: hidden;

				.u-transition {
					width: 100%;
					height: 100%;
				}
			}
		}

		.fuwei {
			transition: top 0.1s ease-in;
		}
	}
</style>
