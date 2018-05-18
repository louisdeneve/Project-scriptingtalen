class ColouredDrops{

    constructor(args){
        this.board = args.board;
        this.size = args.size;
        this.message;
        this.new_game(this.size);
        this.kleur = "niets";
        this.score = 0;
    }

    new_game(size=5) {
        let data = {
            actie: 'new_game',
            size: size,
        };

        if(size >= 25){
            this.dialog("#dialoogvenster", "warning", "The maximum dimension for this game is 24x24", "Warning");
        } else {
            fetch('cgi-bin/script.py?data=' + JSON.stringify(data), { credentials: 'same-origin' })
                .then(response => response.json())
                .then(data => this.makeBoard(data));
        }

    }

    makeBoard(data) {
        this.board = data['board'];
        this.score = data['score'];
        this.message = data["message"];
        $('.dropdown-menu').html(data['moves'].map(colour => '<a class="dropdown-item" href="#">' + colour + '</a>'));

        $("#showScore").html('<h5>Steps <span class="badge badge-secondary">' + data['score'] + '</span></h5>');

        let weergave = this.board.map((row, index1) => row.map((color,index2)=> {
            return `<td><div class="bolletje" style= "background-color: ${color}" data-row="${index1}" data-index="${index2}"></div></td>`;
        }).join("\n")).join("</tr><tr>\n");

        $("#bord").html('<table><tr>' + weergave + '</tr></table>');
        $(".dropdown-item").click(this.selectedColour.bind(this));
        $(".bolletje").click(this.selectedBolletje.bind(this));
        if(this.message !== undefined){
            this.dialog("#dialoogvenster", "success", data['message'], "You win");
        }

    }

    do_move(kleur, pos=[0,0]) {
        let data = {
            board: this.board,
            actie: 'do_move',
            kleur: kleur,
            pos: pos,
            score: this.score
        };

        fetch('cgi-bin/script.py?data=' + JSON.stringify(data), { credentials: 'same-origin' })
            .then(response => response.json())
            .then(data => this.makeBoard(data));

    }

    selectedColour(event){
        this.kleur = $(event.target).text();
    }

    selectedBolletje(event){
        let bol = $(event.target);
        if(bol.data("row") === 0 && bol.data("index") === 0){
            this.do_move(this.kleur);
        }
    }

    dialog(selector, type, boodschap, titel) {

        const titels = {
            "success": "Succes",
            "warning": "Waarschuwing"
        };

        const $dialog = $(selector);
        const $dialog_header = $dialog.find('.modal-header');
        const $dialog_body = $dialog.find('.modal-body');
        const $dialog_btn = $dialog.find('.btn');

        Object.keys(titels).forEach((type) => {
            $dialog_header.removeClass('bg-' + type);
            $dialog_body.removeClass('text-' + type);
            $dialog_btn.removeClass('btn-' + type);
        });

        if (titels.hasOwnProperty(type)) {
            $dialog_header.addClass('bg-' + type);
            $dialog_body.addClass('text-' + type);
            $dialog_btn.addClass('btn-' + type);
        }

        $dialog_body.find('p').html(boodschap);

        titel = titel || titels[type] || "";
        $dialog_header.find('h5').html(titel);

        $dialog.modal();

    }


}