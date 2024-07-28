import React from 'react';
import { Page, Text, Image, Document, StyleSheet, View } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    body: {
      paddingTop: 35,
      paddingBottom: 65,
      paddingHorizontal: 35,
    },
    title: {
      fontSize: 24,
      textAlign: 'center',
      fontFamily: 'Arial'
    },
    author: {
      fontSize: 12,
      textAlign: 'center',
      marginBottom: 40,
    },
    subtitle: {
      fontSize: 18,
      margin: 12,
      fontFamily: 'Arial'
    },
    text: {
      margin: 12,
      fontSize: 14,
      textAlign: 'justify',
      fontFamily: 'Times-Roman'
    },
    image: {
      marginVertical: 15,
      marginHorizontal: 100,
    },
    header: {
      fontSize: 12,
      marginBottom: 20,
      textAlign: 'center',
      color: 'grey',
    },
    pageNumber: {
      position: 'absolute',
      fontSize: 12,
      bottom: 30,
      left: 0,
      right: 0,
      textAlign: 'center',
      color: 'grey',
    },
  });

export const NeinDocument = () => (
    <Document> 
        <Page size="A4" style={styles.body}>
        <Text style={styles.header} fixed>
            Los Pollos Hermanos
        </Text>
        <Text style={styles.title}>The Time I And The With For Same</Text>
        <Text style={styles.author}>Desmond Benjamin</Text>
            <Text style={styles.text}>
            He couldn't remember exactly where he had read it, but he was sure that he had. 
            The fact that she didn't believe him was quite frustrating as he began to search 
            the Internet to find the article. It wasn't as if it was something that seemed impossible. 
            Yet she insisted on always seeing the source whenever he stated a fact.
            Sometimes it just doesn't make sense. The man walking down the street in a banana suit. 
            The llama standing in the middle of the road. The fairies dancing in front of the car window. 
            The fact that all of this was actually happening and wasn't a dream.
            Then came the night of the first falling star. It was seen early in the morning, rushing over 
            Winchester eastward, a line of flame high in the atmosphere. Hundreds must have seen it and taken 
            it for an ordinary falling star. It seemed that it fell to earth about one hundred miles east of
            him.
            </Text>
            <Text style={styles.text}>
            The time had come for Nancy to say goodbye. She had been dreading this moment for a good six months, and it had finally arrived despite her best efforts to forestall it. No matter how hard she tried, she couldn't keep the inevitable from happening. So the time had come for a normal person to say goodbye and move on. It was at this moment that Nancy decided not to be a normal person. After all the time and effort she had expended, she couldn't bring herself to do it.
    There was something in the tree. It was difficult to tell from the ground, but Rachael could see movement. She squinted her eyes and peered in the direction of the movement, trying to decipher exactly what she had spied. The more she peered, however, the more she thought it might be a figment of her imagination. Nothing seemed to move until the moment she began to take her eyes off the tree. Then in the corner of her eye, she would see the movement again and begin the process of staring again.
    The headphones were on. They had been utilized on purpose. She could hear her mom yelling in the background, but couldn't make out exactly what the yelling was about. That was exactly why she had put them on. She knew her mom would enter her room at any minute, and she could pretend that she hadn't heard any of the previous yelling.
            </Text>
    </Page>
  </Document>
)