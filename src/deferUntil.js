import { ignoreElements, concat } from "rxjs/operators";

export default function deferUntil(fx) {
    return (source$) => {

        const continue$ = fx(source$);

        return continue$.pipe(
            ignoreElements(),
            concat(source$)
        );

    }
}