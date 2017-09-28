import { invalidated } from "rxq/operators/handle";
import { getLayout } from "rxq/operators/genericobject";

export default function layouts() {
    return (source$) => {
        return source$.pipe(
            invalidated(),
            getLayout()
        );
    }
}