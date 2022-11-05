<template>
	<view class="CirContent__">
		<view class="u-page">
			<view class="u-demo-block">
				<view class="u-demo-block__content">

					<template v-if="dataList.length > 0">
						<template v-for="(item, index) in dataList">
							<view :key="item.id || index" class="album">
									<view class="album__avatar">
										<image :src="profile" mode="" style="width: 100%; height: 100%">
										</image>
									</view>
									<view class="album__content">
										<u--text text="BORING GHOST" color="#576b95" bold size="17"></u--text>
										<u--text style="word-break: break-all" margin="0 0 8px 0"
											:text="item.text || 'none'">
										</u--text>
										<u-album :urls="item.urls || []" keyName="src2"></u-album>
										<view class="floor-handle">
											<view class="time">
												{{
                        $u.timeFormat(item.time, "yyyy年mm月dd日") ||
                        "2022年8月1号"
                      }}
											</view>
											<view @click="deletEvent(item.id)" class="btn">删除</view>
										</view>
									</view>
							</view>
						</template>
					</template>
					<u-empty v-else text="还莫得发任何说说~" icon="/static/image/null.gif"> </u-empty>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	/* Api */
	import { deleteCirApi } from '@/api/circle.js';

	export default {
		name: 'CirContentIndex',
		data() {
			return { albumWidth: 0, };
		},
		props: {
			// 头像
			profile: {
				type: String,
				required: true,
			},
			// 数据
			dataList: {
				type: Array,
				default: () => [],
			},
		},
		methods: {
			//删除某个说说
			deletEvent(id) {
				try {
					if (id) {
						uni.showModal({
							title: '提示',
							content: '是否删除',
							success: async res => {
								if (res.confirm) {
									await deleteCirApi(id);
									this.$u.toast('删除成功');
									this.$emit('delet');
								}
							},
						});
					}
				} catch (e) {
					//TODO handle the exception
				}
			},
		},

	};
</script>

<style lang="scss" scoped>
	.album {
		@include flex;
		align-items: flex-start;
		margin-bottom: 30px;
		width: 100%;

		&__avatar {
			background-color: $u-bg-color;
			width: 32px;
			height: 32px;
			padding: 0px;
			border-radius: 3px;
		}

		&__content {
			margin-left: 10px;
			width: 100%;

			.floor-handle {
				display: flex;
				justify-content: space-between;
				padding: 20rpx 0 0 0;
				text-align: center;

				.time {
					color: #576b95;
				}

				.btn {
					color: #576b95;
				}
			}
		}
	}
</style>
