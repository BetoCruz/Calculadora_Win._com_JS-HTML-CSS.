class CalcController{
    // havera atributos e metodos 
    constructor(){  

        this._lastOperator = "";
        this._lastNumber = "";
        this._operation = [];
        this._displayCalcEl = document.querySelector("#display"); // propriedade ligada ao seletor.
        this.initialize(); //Metodo para iniciar o display da calculadora.
        this.initButtonsEvents();
        this.initKeyboard();
    }

    
    pasteFromClipboard(){

        document.addEventListener("paste", e=>{ // "e" controla as informaçoes a serem acessadas.

            let text = e.clipboardData.getData("Text"); //acesso a area de transferencia.

            this.displayCalc = parseFloat(text);
        });
    }



        // metodo para copiar conteúdos./o valor do display vai para input e com marcação
    copyToClipboard(){  

        let input = document.createElement("input");// cria se o elemento na tela 

        input.value = this.displayCalc //atribuimos o valor da calculadora no input.

        document.body.appendChild(input); // inserimos no corpo do body o input, para conseguirmos selecionar

        input.select(); //selecionamos o conteudo 

        document.execCommand("Copy") // copia a informação selecionada e envia para o sistema.

        input.remove(); // removemos a janela de input.
    }



    initialize(){
        this.setLastNumberToDisplay();
        this.pasteFromClipboard();             
    }
    
    
    
    initKeyboard(){
        document.addEventListener("keyup", e=>{ // aplicação de evento e função para o teclado.                       
        switch(e.key){// e representa o evento e atraves do key capturamos os botões.
            case "%":
                this.addOperation(e.key);
                break;            
            case "√":
                        
                break;    
            case "x²":
                
                break;
            case "¹/x":
                        
                break;
                
            case "Escape":
                this.clearAll();
                break;
        
            case "Backspace":
                this.clearEntry();
                break;                
                case "/":
            case "*":
            case "-":
            case "+":
                this.addOperation(e.key);
                break;                
            case "=":
            case "Enter":
                this.calc();
                break;             
            case ".":
            case ",":
                this.addDot();
                break;
                //---------------------------------------------    
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":    
                this.addOperation(parseInt(e.key));
                break;
            
            case "c":
                if(e.ctrlKey) this.copyToClipboard();
                break;        
            }            
        });
    }



     // Metodo para fazer a junção de vairos eventos de escuta com elementos.
    addEventListenerAll(element, events, fn){
        events.split(" ").forEach(event =>{
            element.addEventListener(event, fn, false);
        });
    }



    clearAll(){
        this._operation = [];
        this._lastNumber = "";
        this._lastOperator = "";
        this.setLastNumberToDisplay();
    }



    clearEntry(){
        this._operation.pop(); // retira a ultima entrada acorrida no Array"this._operation".
        this.setLastNumberToDisplay();
    }
    
    
    
    //----------retorna o ultimo elemento da array
    getLastOperation(){
       return this._operation[this._operation.length-1];
    }




    //----------troca a posição do ultimo valor no Array.
    setLastOperation(value){
        this._operation[this._operation.length-1]=value;
    }



    isOperator(value){
        return (["+","-","*","%","/","√"].indexOf(value) > - 1);    
    }
 


    // adiciona operador e verifica se há 3 itens .
    pushOperation(value){
        this._operation.push(value);

        if(this._operation.length > 3){
            
            this.calc();
        }
    }

    getResult(){
        try{
            return eval(this._operation.join(""));
        }catch(e){
            setTimeout(()=>{
                this.setError();
            },1);           
        }
    }



        //realiza os calculos
    calc(){

        let last = '';

        this._lastOperator = this.getLastItem();//Guarda o ultimo operador.

        if(this._operation.lenght < 3){ // verifica a extensão do Array.

            let firstItem = this._operation[0]; //o primeiro item recebe a posição.
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }


        if (this._operation.length > 3){ //Possuindo mais de 3 itens faz se o calculo.

            last = this._operation.pop();// guarda na variavel o ultimo numero digitado.           
            this._lastNumber = this.getResult();//Numero que foi calculado quando + de 3 itens.

            
        } else if (this._operation.lenght == 3) {//caso não seja atendido no if ira para o else if.

            this._lastNumber = this.getLastItem(false);// Guardar o ultimo numero.
        }

        

        let result = this.getResult(); // join retira as virgulas e calcula a string.

        if( last == "√"){
            result = (Math.sqrt(result));
            this._operation = [result];
        }else{
            this._operation = [result]; // novo Array com resultado e ultimo numero aguardando prox. operação.
            if (last) this._operation.push(last);
        }



        if (last == "%"){

           result /= 100;

           this._operation = [result];

        }else {
            
            this._operation = [result]; // novo Array com resultado e ultimo numero aguardando prox. operação.

            if (last) this._operation.push(last);

        }

        this.setLastNumberToDisplay();
    }




    getLastItem(isOperator = true){// captura ultimo item e verifica se é operador numerico.

        let lastItem;

        for(let i = this._operation.length-1; i >= 0; i--){//Percorre o Array de forma decremental.

            if(this.isOperator(this._operation[i]) == isOperator){ //No percorrer  avalia se  é operador/sendo numero, add à variável lastNumber.
                lastItem = this._operation[i];  //variável recebe o elemento do array. 
                break;
            }
            if (!lastItem){ // caso não haja um lastItem, retorne o ultimo operador valido, ou numero.
                lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
            }
        }
        return lastItem;
    }



    // Adiciona ao display.
    setLastNumberToDisplay(){
               
        let lastNumber = this.getLastItem(false);

        if(!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
    }



    addOperation(value){//adiciona valores à operação, o parametro é o valor em questão 
                  
        if (isNaN(this.getLastOperation())){// verificando se o ultimo numero do array é um numero ou 

            if(this.isOperator(value)) { // num do momento, verificando se é um operador

                //---troca a posição do ultimo valor no Array substitui o ->"this._operation[this._operation.length-1]=value;""
                this.setLastOperation(value);
                

            }else {
                this.pushOperation(value); //adiciona-se o ooperador
                this.setLastNumberToDisplay();
            }

        }else{

            if(this.isOperator(value)){

                this.pushOperation(value);

            }else{

                let newValue = this.getLastOperation().toString()+value.toString();
                this.setLastOperation(newValue);//---troca o ultimo valor no Array pelo atual, transformando de string para interiro

                this.setLastNumberToDisplay();
            }            
        }
    }
    


    setError(){
        this.displayCalc = "Error";
    }



    addDot(){

        let lastOperation = this.getLastOperation();

        if ( typeof lastOperation === "string" && lastOpertaion.split("").indexOf(".") > -1)return//verificamos se já há um ponto , ou não, Verifica se é String, separa os itens do Array e procura o operador ".";

        if(this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation("0.");
        }else {
            this.setLastOperation(lastOperation.toString() + ".");
        }

        this.setLastNumberToDisplay();
    }


    
    execBtn(value){
        switch(value){
        case "%":
            this.addOperation("%");
            break;            
        case "√":
            this.addOperation("√");
            break;    
        case "x²":
                
            break;
        case "¹/x":
                
            break;
        case "CE":
            this.clearEntry();
            break;
        
        case "C":
            this.clearAll();
            break;

        case "←":
            this.clearEntry();
            break;
        
        case "÷":
            this.addOperation('/');
            break;

        case "X":
            this.addOperation('*');
            break;
        case "-":
            this.addOperation('-');
            break;

        case "+":
            this.addOperation('+');
            break;
        
        case "=":
            this.calc();
            break;

        case ",":
            this.addDot();
            break;
            
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            this.addOperation(parseInt(value));
            break;

        default:
            this.setError();
            break;
        }
    }

   

    initButtonsEvents(){
        let buttons = document.querySelectorAll(".row > button");// captura os elementos da class row, os botões.

        buttons.forEach((btn, index) =>{//para cada botão associa-se os eventos de escuta 
            this.addEventListenerAll(btn, "click drag", e =>{
                
                let textBtn = btn.innerHTML;                

                this.execBtn(textBtn);
            })


            this.addEventListenerAll(btn, "mouseover mousedown mouseup", e =>{
                btn.style.cursor ="pointer";//adicionamos eventos de escuta e estilizamos o ponteiro do mouse.
            });
        });
    }


    
    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }



    set displayCalc(value){

        if (value.toString().lenght > 10){
            this.setError();
            return false;
        }
        return this._displayCalcEl.innerHTML = value;
    }
}