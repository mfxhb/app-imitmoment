// 生成一个不同上一个数的随机数
export function createRandomNum(min, max) {
	if ((!max && max !== 0) || (!min && min !== 0)) throw new Error('error');
	max++;
	let lastNum = 0;
	return function num() {
		const randomNum = Math.floor(Math.random() * (max - min) + min);
		if (randomNum === lastNum) {
			return num()
		} else {
			lastNum = randomNum
			return randomNum
		}
	}
}

// 是否为空
export function isNull(value) {
	if (value === 0) return false;
	if (!value) return true;
	if (value === JSON.stringify('[]')) return true;
	if (value === JSON.stringify('{}')) return true;
	return false;
}


// 查看一个对象是否包含某些属性
export function isHaveAttributes(obj, atrributes = []) {
	try {
		const keys = Object.keys(obj);
		for (let k = 0, len = atrributes.length; k < len; k++) {
			const item = atrributes[k];
			if (!keys.includes(item)) return false;
		}
		return true;
	} catch (e) {
		return false;
	}
}

// 查看这个值value是否为type类型,如果不是就返回default_v默认值
export function isValueTheType(value, type, default_v) {
	let result;
	switch (type) {
		case 'String':
			result = typeof value === 'string' ? value : default_v;
			break;
		case 'Number':
			result = typeof value === 'number' ? value : default_v;
			break;
		case 'Array':
			// FIX : instanceof 不管用
			result = Array.isArray(value) ? value : default_v;
			break;
		case 'Object':
			result = Object.prototype.toString.call(value) === '[obejct Object]' ? value : default_v;
			break;
	}
	return result
}
