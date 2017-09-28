import { createSessionObject } from "rxq/operators/doc";
import { setProperties } from "rxq/operators/genericobject";
import { first, combineLatest, mergeMap, skip, publish, mapTo, switchMap, publishReplay, refCount } from "rxjs/operators";
import { of } from "rxjs/observable/of";

export default function createDynamicObject(def$) {
    const firstDef$ = def$.pipe(first());
    const newDef$ = def$.pipe(skip(1));

    return (app$) => {
        

        // Create object if not already created
        const obj$ = app$.pipe(
            combineLatest(firstDef$),
            mergeMap(([appHandle, def]) => {
                return of(appHandle).pipe(
                    createSessionObject(def)
                );
            })
        ).pipe(
            publishReplay(1),
            refCount()
        );;

        // Update object; Always connected, may need better way to handle connecting & disconnecting this
        obj$.pipe(
            combineLatest(newDef$),
            switchMap(([objHandle, def]) => {
                const h$ = of(objHandle);
                return h$.pipe(
                    setProperties(def)
                )
            }),
            publish()
        ).connect();
    
        return obj$;
    }
}