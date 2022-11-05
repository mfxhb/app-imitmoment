<template>
	<view class="Project__">
		<Cards :cardsList='projectList' />
	</view>
</template>

<script>
	/* 组件 */
	import Cards from './cards.vue'
	/* api */
	import { readProjectApi } from '@/api/project.js'

	export default {
		name: 'ProjectsIndex',
		data() {
			return {}
		},
		onNavigationBarButtonTap({ index }) {
			// 导航栏右侧被点击
			if (index === 0) {
				uni.navigateTo({ url: '/pages/createProject/createProject' });
			}
		},
		created() {
			this.getProjectInfo()
		},
		computed: {
			projectList() {
				return this.$store.state.project.projectDataList || []
			}
		},
		methods: {
			dataList() {},
			// 获取项目数据
			getProjectInfo() {
				try {
					this.$store.dispatch('project/readProjectInfo')
				} catch (e) {
					//TODO handle the exception
				}
			}
		},
		async onPullDownRefresh(){
			this.getProjectInfo()
			uni.stopPullDownRefresh();
		},
		components: { Cards },
	}
</script>

<style lang="scss" scoped>
	.Project__ {
		padding: 20rpx;
		box-sizing: border-box;
		background-color: #ececec;
		/* #ifdef H5 */
		min-height: calc(100vh - var(--window-bottom) - 44px - var(--status-bar-height));
		/* #endif */
		/* #ifdef APP-PLUS */
		min-height: 100vh;
		/* #endif */
	}
</style>
