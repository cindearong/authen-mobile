import { Pressable, View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { GlobalStyles } from "../constants/styles";
import { getFormattedDate } from "../util/date";
import { useNavigation } from "@react-navigation/native";

function ExpenseItem ({id, description, amount, date}) {
    const navigation = useNavigation();

    function expensePressHandler() {
        console.log('Pressed!');
        navigation.navigate('ManageExpense',{
            expenseId: id
        });
    }

    return (
    <Pressable 
    onPress={expensePressHandler} 
    style={({pressed}) => pressed && styles.pressed}
    >
        <View style={styles.expenseItem}>
            <View>
                <Text style={[styles.textBase, styles.description]}>
                    {description}
                </Text>
                <Text style={styles.textBase}>{date ? getFormattedDate(date): ''}</Text>
            </View>
            <View style={styles.amountContainer}>
                <Text style={styles.amount}>{amount.toFixed(2)}</Text>
            </View>
        </View>
    </Pressable>
    );
}

export default ExpenseItem;

const styles = StyleSheet.create({
  expenseItem: {
    padding: 16,
    marginVertical: 10,
    backgroundColor: GlobalStyles.colors.primary100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    elevation: 4,
    shadowColor: 'black',
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
  },
  description: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: 'bold',
    color: GlobalStyles.colors.primary800,
  },
  amountContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: GlobalStyles.colors.primary50,
    borderRadius: 8,
    minWidth: 90,
    alignItems: 'flex-end',
  },
  amount: {
    fontWeight: '900',
    fontSize: 16,
    color: GlobalStyles.colors.primary500,
  },
});