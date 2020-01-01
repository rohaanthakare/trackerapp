export class DataLoadModule {
    moduleName: string;
    dataFileName: string;
    dataFilePath: string;
    actionName: string;
    action: string;
    recordsToLoad: number;
    recordsLoaded: number;
    recordsFailed: number;
    remainingRecords: number;
    uploadedPercentage: number;
    failedPercentage: number;
    remainingPercentage: number;
    records: any[];
}
