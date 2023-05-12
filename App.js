import * as React from 'react';
import { Alert, Image, ImageBackground, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';

const AuthContext = React.createContext();

function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

function IniScreen() {
  const { signOut } = React.useContext(AuthContext);

  return (
    <ImageBackground
      source={require('./src/assets/FameMain.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Pressable style={styles.button} onPress={signOut}>
          <Text style={styles.text}>Cerrar sesión</Text>
        </Pressable>
        <HomeScreen></HomeScreen>
      </View>
    </ImageBackground>
  );
}

function SignInScreen() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { signIn } = React.useContext(AuthContext);
  const image = {
    uri: 'https://picsum.photos/200/300',
  };

  return (
    <ImageBackground
      source={require('./src/assets/FameIni.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <TextInput
          style={styles.login}
          placeholder="Usuario"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.login}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Pressable style={styles.button} onPress={() => signIn({ username, password })}>
          <Text style={styles.text}>Iniciar sesión</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: 'blue',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  login: {
    paddingHorizontal: 15,
    padding: 5,
    width: 200,
    borderRadius: 10,
    borderColor: 'red',
    color: '#000000',
    backgroundColor: '#F2F1F1',
    marginBottom: 5,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});

const Stack = createNativeStackNavigator();

export default function App({ navigation }) {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      try {
        console.log('userToken-->', userToken);
      } catch (e) {
        console.log('Error', e);
      }
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        console.log('data--->', data);
        if (data != null &&
          data.username != null && data.username != '' &&
          data.password != null && data.password != '' &&
          data.username == 'david' && data.password == '123') {
          console.log('data--->', data.username);
          console.log('data--->', data.password);
          dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
        } else {
          console.log('data--> null');
          Alert.alert('Nombre de usuario o contraseña incorrectos. inténtelo de nuevo.');
        }
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async (data) => {
        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {state.isLoading ? (
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : state.userToken == null ? (
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{
                title: 'Autenticación',
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
          ) : (
            <Stack.Screen name="Pantalla Principal" component={IniScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
