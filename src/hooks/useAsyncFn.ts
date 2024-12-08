import { ref, type Ref } from "vue";

export function useLoading<T extends (...args: any[]) => Promise<any>>(
	asyncFn: T,
): [(...args: Parameters<T>) => Promise<ReturnType<T>>, { isLoading: Ref<boolean>; isFulfilled: Ref<boolean> }] {
	const isLoading = ref(false);
	const isFulfilled = ref(false);

	const wrappedAsyncFn = async (...args: Parameters<T>): Promise<ReturnType<T>> => {
		isLoading.value = true;
		isFulfilled.value = false;

		try {
			const result = await asyncFn(...args);
			isFulfilled.value = true;
			return result;
		} finally {
			isLoading.value = false;
		}
	};

	return [wrappedAsyncFn, { isLoading, isFulfilled }];
}
