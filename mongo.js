const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}
else{
    if (process.argv.length === 4) {
        console.log('give give name and number as arguments')
        process.exit(1)
    }
    else{
        const password = process.argv[2]
        const url = `mongodb+srv://otheruser:${password}@cluster0.xsjs2.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

        mongoose.connect(url)
        
        const personSchema = new mongoose.Schema({
          name: String,
          number: String,
        })

        const Person = mongoose.model('Person', personSchema) 

        if(process.argv.length === 3){
            Person.find({}).then(result => {
                result.forEach(person => {
                  console.log(`${person.name} ${person.number}`)
                })
                mongoose.connection.close()
            })
        }
        else{
            const person = new Person({
                name: process.argv[3],
                number: process.argv[4],
            })

            person.save().then(result => {
               console.log(`Added ${person.name} number ${person.number} to phonebook`)
               mongoose.connection.close()
             })
        }
    }
}


  