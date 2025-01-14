import func from './functions.js'
import status from './status.js'

export default {
    async fetch(request, env, params) {

        let paramKeys = Array.from(new Set(params.keys()))

        if (paramKeys.length!=0){
            return func.returnStatus('API error', `URL '/flowpro/random' does not handle requests with any parameters.`)
        }

        function getRandomDate(start, end) {
            let date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
            return date.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
        }

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
        
        function getRandomName() {
            const names = [
                "Alice", "Michael", "Samantha", "David", "Sarah", "James", "Emily", "Robert", 
                "Linda", "Kevin", "Laura", "Steven", "Rachel", "Mark", "Jessica", "Paul", 
                "Nicole", "Daniel", "Angela", "Brian", "Heather", "Christopher", "Sophia", 
                "Peter", "Brandon", "Catherine", "Derek", "Evelyn", "Frank", "Grace", "Hannah", 
                "Ian", "Jack", "Karen", "Leon", "Megan", "Nina", "Oliver", "Patrick", 
                "Quinn", "Rebecca", "Sean", "Tina", "Ursula", "Victor", "Wendy", "Xander", 
                "Yvonne", "Zachary"
            ];
            return names[Math.floor(Math.random() * names.length)];
        }
        
        function generateRandomData() {
            let data = [];
            
            // Ensure "Louis" is included once
            data.push({
                name: "Louis",
                birth_date: new Date().toISOString().split('T')[0]
            });
            
            // Generate the rest of the random data (24 more items)
            for (let i = 0; i < 24; i++) {
                data.push({
                    name: getRandomName(),
                    birth_date: getRandomDate(new Date(1970, 0, 1), new Date(2010, 11, 31))
                });
            }
        
            return {
                response: {data:shuffleArray(data)},
                success: true
            };
        }   

        return new Response(JSON.stringify(generateRandomData()), { headers: { "content-type": "text/plain;charset=UTF-8", }, status: 200 })
    }
}