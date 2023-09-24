import React from 'react';
import { StyleSheet } from 'react-native';
import { DataTable } from 'react-native-paper';

const TableComponent = ({vals}) => {
    console.log(vals,"VALS")
    return (
        <DataTable style={styles.container}>
            <DataTable.Header style={styles.tableHeader}>
                <DataTable.Title>{vals[0].substring(2)}</DataTable.Title>
                <DataTable.Title>{vals[1]}</DataTable.Title>
                <DataTable.Title>{vals[2]}</DataTable.Title>
            </DataTable.Header>
            <DataTable.Row>
                <DataTable.Cell>{vals[3]}</DataTable.Cell>
                <DataTable.Cell>{vals[4]}</DataTable.Cell>
                <DataTable.Cell>{vals[5]}</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
                <DataTable.Cell>{vals[6]}</DataTable.Cell>
                <DataTable.Cell>{vals[7]}</DataTable.Cell>
                <DataTable.Cell>{vals[8]}</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
                <DataTable.Cell>{vals[9]}</DataTable.Cell>
                <DataTable.Cell>{vals[10]}</DataTable.Cell>
                <DataTable.Cell>{vals[11]}</DataTable.Cell>
            </DataTable.Row>
        </DataTable>
    );
};

export default TableComponent;

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    tableHeader: {
        backgroundColor: '#DCDCDC',
    },
});
