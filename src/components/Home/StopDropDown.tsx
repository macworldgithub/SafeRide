import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';

interface ReturnType{
    selected: boolean;
    value: string;
}

interface Props {
    returnType: ReturnType;
    setReturnValue: (value: ReturnType) => void;
    serviceType: string;
}

export const StopDropDown: React.FC<Props> = ({returnType, setReturnValue, serviceType}) => {
    let stopOptions = [
        { title: 'Stop on Way There' },
    ];

    if (serviceType === "R") {
        stopOptions = [
            { title: 'Stop Only on Way There' },
            { title: 'Stop Only on Return' },
            { title: 'Stop Both Ways' },
        ];
    }

    return (
        <View style={styles.dropdowncontainer}>
            <SelectDropdown
                data={stopOptions}
                onSelect={(selectedItem, index) => {
                    console.log(selectedItem, index);
                    setReturnValue({
                        selected: true,
                        value: selectedItem.title
                    });
                }}
                renderButton={(selectedItem, isOpened) => {
                    return (
                        <View style={styles.dropdownButtonStyle}>
                            <Text style={styles.dropdownButtonTxtStyle}>
                                {(selectedItem && selectedItem.title) || returnType.value}
                            </Text>
                        </View>
                    );
                }}
                renderItem={(item, index, isSelected) => {
                    return (
                        <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                            <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                        </View>
                    );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownMenuStyle}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    dropdowncontainer: {
        width: '80%'
    },
    dropdownButtonStyle: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 15,
        color: '#4E4E4E',
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
    },
    dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
});