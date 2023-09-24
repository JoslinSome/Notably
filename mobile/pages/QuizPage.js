import {View, StyleSheet, Text, TouchableOpacity} from "react-native";
import {useEffect, useRef, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import axios from "axios";
import {api} from "../config/Api";

export default function QuizPage({route}){

    const { user, notebook } = route.params;
    const [notes, setNotes] = useState([]);
    const navigation = useNavigation();
    const once = useRef(true);
    const [quizQuestions, setQuizQuestions] = useState([])
    const questionRef = useRef([]);
    const [index, setIndex] = useState(0)
    const [showAnswer, setShowAnswer] = useState(false);
    useEffect(() => {
        // Get all the notes from the server
        axios
            .get("http://" + api + `/notes/get-by-notebook/${notebook._id}`,{}, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then( (response) => {
                setNotes(response.data);
                if (once.current) {
                    console.log("ONCE")
                    let string = ""
                    for (let i = 0; i < response.data.length; i++) {
                        string += response.data[i].content
                    }
                    axios
                        .get("http://" + api + `/notes/get-flash-cards`, {params: {text: string}}, {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        }).then(r => {
                            console.log("Response: ", r.data.content)
                            setQuizQuestions(JSON.parse(r.data.content))
                            questionRef.current =JSON.parse(r.data.content)
                            console.log("Done")
                        }).catch(e => console.log("Error getting flashcards"))
                    once.current = false
                }
            })
            .catch((error) => {
                console.log("Erroer: ", error);
            });
    }, []);

    function QuizCard({type,text,onPress}){
        console.log("Text is",text,quizQuestions)
        if(type !== "question"){
                text = showAnswer? quizQuestions[index]['answer']: "Tap to view answer"
        }
        return(
            <TouchableOpacity style={type === 'question' ? styles.quizCard: styles.answerCard} onPress={onPress || null}>
                <Text style={styles.quizText}>{text}</Text>
            </TouchableOpacity>
        )
    }
    return(
        <View style={styles.container}>
            <Text style={styles.text}>QuizPage</Text>
            <View style={styles.quiz}>
                <QuizCard type={"question"} text={quizQuestions.length>0? quizQuestions[index]['question']: "Quiz Card"}/>
                <QuizCard onPress={()=>setShowAnswer(!showAnswer)} text={quizQuestions.length>0? quizQuestions[index]['answer']: "Quiz Card"}/>
            </View>
            <View style={styles.row}>
                <TouchableOpacity style={styles.btn} onPress={()=>setIndex((index-1)%quizQuestions.length)}>
                    <Text style={styles.quizText}>Prev</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={()=>setIndex((index+1)%quizQuestions.length)}>
                    <Text style={styles.quizText}>Next</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "rgb(212,195,232)",
        height: '100%'
    },
    quiz: {
        marginTop: 20
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 40,
        marginLeft: 10,
        color: '#271660'
    },
    row: {
        flexDirection: "row",
        justifyContent: 'space-between',
        marginLeft: 18,
        marginRight: 18,
        marginTop: -45
    },
    btn: {
       backgroundColor: "#0e2e7a",
        height: 30,
        width: 60,
        alignItems: "center"
    },
    quizCard: {
        backgroundColor: '#051938',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '2.5%',
        width: '93%',
        marginTop: 15,
        height: '40%',
        borderRadius: 15
    },
    answerCard:{
        backgroundColor: '#3a70c4',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '2.5%',
        width: '93%',
        marginTop: 30,
        height: '40%',
        borderRadius: 15
    },
    quizText: {
        color: "#fff",
        fontWeight: 'bold'
    }
})
