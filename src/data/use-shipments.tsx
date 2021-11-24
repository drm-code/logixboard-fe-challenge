import { useTimeout } from "beautiful-react-hooks";
import { useMemo, useState } from "react";
import { Shipment } from "./Shipment";
import { SHIPMENTS_DATA } from "./shipments-data";
import { format } from 'date-fns'

type LoadingResult = {
    status: 'LOADING'
}

type ErrorResult = {
    status: 'ERROR'
    message: string
}

type SuccessResult = {
    status: 'SUCCESS'
    shipments: Shipment[]
}

export type UseShipmentsResult =
    | LoadingResult
    | ErrorResult
    | SuccessResult

export type UseShipmentsStatus = Pick<UseShipmentsResult, 'status'>

const INITIAL_RESULT: LoadingResult = {
    status: 'LOADING'
}

// To make your life easier, we'll adjust the dates to be more current
const millisToAdd = new Date().getTime() - new Date("4/19/19").getTime()
const adjustDateString = (dateString: string): string => {
    const originalTimeInMillis = new Date(dateString).getTime()
    const newTimeInMillis = originalTimeInMillis + millisToAdd
    const adjustedDate = new Date(newTimeInMillis)
    return format(adjustedDate, 'MM/dd/yy')
}

const adjustShipmentDates = (shipments: Shipment[]): Shipment[] => shipments.map(shipment => ({
    ...shipment,
    estimatedArrival: adjustDateString(shipment.estimatedArrival),
    estimatedDeparture: adjustDateString(shipment.estimatedDeparture)
}))

// Feel free to change this constant to a really high % during your testing to
// make sure your failure handling works, and to a low number while you're
// developing / testing your success case
const FAILURE_RATIO = 0.05

// This hook is meant to simulate a network call that takes some amount of time
// and can fail. You're welcome to change the interface here to support returning
// a subset of the data, but please don't just import the SHIPMENTS_DATA array
// directly :)
export const useShipments = (): UseShipmentsResult => {
    const [result, setResult] = useState<UseShipmentsResult>(INITIAL_RESULT)

    // Wait a random amount of time between 200 ms and 2000 ms to simulate
    // a network call
    const waitTimeMillis = useMemo(() => 200 + 1800 * Math.random(), [])
    useTimeout(() => {
        // Let's introduce a random failure case some percent of the time.
        const shouldFail = Math.random() < FAILURE_RATIO
        if (shouldFail) {
            setResult({
                status: 'ERROR',
                message: 'Something went wrong'
            })
        } else {
            setResult({
                status: 'SUCCESS',
                shipments: adjustShipmentDates(SHIPMENTS_DATA)
            })
        }
    }, waitTimeMillis)

    return result
}