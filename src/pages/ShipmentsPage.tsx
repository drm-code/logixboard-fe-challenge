import { ReactElement } from "react"
import { Box, makeStyles, useTheme } from "@material-ui/core"
import { DataGrid, GridColDef } from "@material-ui/data-grid"
import Loader from 'react-loader-spinner'
import { useShipments } from "../data/use-shipments"

const COLUMNS: GridColDef[] = [
    {
        field: 'houseBillNumber',
        headerName: 'House Bill',
        width: 150
    },
    {
        field: 'client',
        headerName: 'Shipper',
        width: 200
    },
    {
        field: 'origin',
        headerName: 'Origin',
        width: 400
    },
    {
        field: 'destination',
        headerName: 'Destination',
        width: 400
    },
    {
        field: 'mode',
        headerName: 'Mode',
        width: 200
    },
    {
        field: 'estimatedDeparture',
        headerName: 'Estimated Departure',
        width: 200
    },
    {
        field: 'estimatedArrival',
        headerName: 'Estimated Arrival',
        width: 200
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 200
    }
]

const useStyles = makeStyles({
    grid: {
        marginInline: 16,
        height: 'calc(100% - 80px)'
    },
    loader: {
        margin: 'auto',
        width: 'fit-content',
        marginTop: 200
    }
})
export const ShipmentsPage: React.FC = () => {
    const classes = useStyles()
    const useShipmentsResult = useShipments()
    const theme = useTheme()

    let component: ReactElement
    switch (useShipmentsResult.status) {
        case 'SUCCESS':
            component = <DataGrid
                className={classes.grid}
                rows={useShipmentsResult.shipments}
                columns={COLUMNS}
                pageSize={20}
                disableSelectionOnClick
								autoPageSize
            />
            break;
        case 'LOADING':
            component = <Box className={classes.loader}>
                <Loader type="Grid" color={theme.palette.primary.main} />
            </Box >
            break
        case 'ERROR':
            component = <p>Error</p>
            break
    }

    return component
}