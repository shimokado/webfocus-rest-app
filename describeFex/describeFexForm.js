const fullPath = "IBFS:/WFC/Repository/test/amptest.fex"; // FEXファイルのフルパス
const rsUrl = "http://localhost:8080/ibi_apps/rs";  // REST APIのURL

// describeFex APIを使用して変数情報を取得する関数
async function fetchVariableInfo(fullPath) {
    const params = new URLSearchParams({
        IBIRS_action: 'describeFex',
        IBIRS_service: 'ibfs',
        IBIRS_path: fullPath,
        IBIRS_random: Math.random().toString(36).substring(2) // キャッシュ防止
    });

    const url = `${rsUrl}?${params.toString()}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`変数情報の取得に失敗しました: ${response.status} ${response.statusText}`);
        }

        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

        const rootObject = {};
        const rootElement = xmlDoc.querySelector('rootObject');
        if (rootElement) {
            Array.from(rootElement.attributes).forEach(attr => {
                rootObject[attr.name] = attr.value;
            });
        }

        const bindingInfo = {};
        const bindingInfoElement = xmlDoc.querySelector('bindingInfo');
        if (bindingInfoElement) {
            bindingInfoElement.querySelectorAll('entry').forEach(entry => {
                const key = entry.querySelector('key')?.getAttribute('value');
                const value = entry.querySelector('value')?.getAttribute('value');
                if (key && value) {
                    bindingInfo[key] = value;
                }
            });
        }

        const amperMap = [];
        const amperMapElement = xmlDoc.querySelector('amperMap');
        if (amperMapElement) {
            amperMapElement.querySelectorAll('entry').forEach(entry => {
                const key = entry.querySelector('key')?.getAttribute('value');
                const value = entry.querySelector('value');
                const type = value?.querySelector('type')?.getAttribute('name');

                if (type === 'defaultType' || type === 'unresolved') {
                    const variable = {
                        name: key,
                        type,
                        format: value?.getAttribute('format') || '',
                        description: value?.getAttribute('description') || '',
                        defaultValue: value?.querySelector('userDefValues > item')?.getAttribute('value') || '',
                        options: Array.from(value?.querySelectorAll('values > entry') || []).map(option => ({
                            key: option.querySelector('key')?.getAttribute('value'),
                            value: option.querySelector('value')?.getAttribute('value'),
                        })),
                    };
                    amperMap.push(variable);
                }
            });
        }

        return { rootObject, bindingInfo, amperMap };
    } catch (error) {
        console.error('変数情報の取得中にエラーが発生しました:', error);
        throw error;
    }
}

/**
 * 変数情報を基にフォームを動的に生成する関数
 * @param {Object} param0 - 変数情報とバインディング情報を含むオブジェクト
 * @param {Array} param0.amperMap - 変数情報の配列
 * @param {Object} param0.bindingInfo - バインディング情報
 */
function createVariableInputForm({ amperMap, bindingInfo }) {
    console.log('変数情報を基にフォームを生成中:', amperMap);
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = ''; // 既存のコンテンツをクリア

    // bindingInfoにIBFS_displayNameが含まれている場合、見出しとして表示
    if (bindingInfo && bindingInfo.IBFS_displayName) {
        const heading = document.createElement('h2');
        heading.textContent = bindingInfo.IBFS_displayName;
        formContainer.appendChild(heading);
    }

    const form = document.createElement('form');
    form.id = 'variable-input-form';

    // 変数名に"prompt_COUNTRY"が含まれる場合、特別な処理を行う
    // 固定値として"JAPAN", "ENGLAND", "ITALY"から選択可能なドロップダウンを生成
    const countryVariable = amperMap.find(variable => variable.name.includes('prompt_COUNTRY'));
    if (countryVariable) {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        const label = document.createElement('label');
        label.htmlFor = countryVariable.name;
        label.textContent = "国を選択してください"; // 固定ラベルを使用
        formGroup.appendChild(label);

        const select = document.createElement('select');
        select.id = countryVariable.name;
        select.name = countryVariable.name;

        const countries = ['JAPAN', 'ENGLAND', 'ITALY'];
        countries.forEach(country => {
            const optionElement = document.createElement('option');
            optionElement.value = country;
            optionElement.textContent = country;
            select.appendChild(optionElement);
        });

        formGroup.appendChild(select);
        form.appendChild(formGroup);
    }

    // 変数名が"prompt_YYMD"の場合、日付選択用のカレンダーを生成
    const dateVariable = amperMap.find(variable => variable.name === 'prompt_YYMD');
    if (dateVariable) {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        const label = document.createElement('label');
        label.htmlFor = dateVariable.name;
        // descriptionがあればそれをラベルに使用、なければ固定ラベルを使用
        label.textContent = dateVariable.description || "年月日を選択してください";
        formGroup.appendChild(label);

        const input = document.createElement('input');
        input.type = 'date';
        input.id = dateVariable.name;
        input.name = dateVariable.name;
        input.value = new Date().toISOString().split('T')[0]; // デフォルト値を今日の日付に設定

        formGroup.appendChild(input);
        form.appendChild(formGroup);
    }

    // 変数名が"prompt_YYM"の場合、年月選択用のカレンダーを生成
    const monthVariable = amperMap.find(variable => variable.name === 'prompt_YYM');
    if (monthVariable) {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        const label = document.createElement('label');
        label.htmlFor = monthVariable.name;
        // descriptionがあればそれをラベルに使用、なければ固定ラベルを使用
        label.textContent = monthVariable.description || "年月を選択してください";
        formGroup.appendChild(label);

        const input = document.createElement('input');
        input.type = 'month';
        input.id = monthVariable.name;
        input.name = monthVariable.name;
        input.value = new Date().toISOString().split('-').slice(0, 2).join('-'); // デフォルト値を今月に設定

        formGroup.appendChild(input);
        form.appendChild(formGroup);
    }

    // すべての変数をループ処理
    amperMap.forEach(variable => {
        // 変数名が"PROMPT_"で始まる場合はスキップ
        if (variable.name.startsWith('prompt_')) {
            return;
        }
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        const label = document.createElement('label');
        label.htmlFor = variable.name;
        // descriptionがあればそれをラベルに使用、なければ変数名を使用
        label.textContent = variable.description || variable.name;
        formGroup.appendChild(label);

        if (variable.options.length > 0) {
            // オプションがある変数の場合、ドロップダウンを生成
            const select = document.createElement('select');
            select.id = variable.name;
            select.name = variable.name;

            variable.options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.key;
                optionElement.textContent = option.value;
                select.appendChild(optionElement);
            });

            formGroup.appendChild(select);
        } else {
            // オプションがない変数の場合、テキスト入力を生成
            const input = document.createElement('input');
            input.type = 'text';
            input.id = variable.name;
            input.name = variable.name;
            input.value = variable.defaultValue;
            // formatの一文字目が'A'の場合、maxLengthをAを除いた数値にする
            // 例えば、formatが'A8'の場合、maxLengthは8になる
            if (variable.format && variable.format.charAt(0) === 'A') {
                const maxLength = parseInt(variable.format.substring(1), 10);
                input.maxLength = maxLength;
            }
            // formatの一文字目が'I','P','D'の場合、typeをnumberにする
            // 例えば、formatが'I8'の場合、typeはnumberになる
            else if (variable.format && (variable.format.charAt(0) === 'I' || variable.format.charAt(0) === 'P' || variable.format.charAt(0) === 'D')) {
                input.type = 'number';
                input.step = 'any'; // 数値入力に小数点を許可
            }

            formGroup.appendChild(input);
        }

        form.appendChild(formGroup);
    });

    // 実行ボタンを追加
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = '実行';
    form.appendChild(submitButton);

    // フォーム送信時のイベントリスナーを追加
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const params = new URLSearchParams();

        for (const [key, value] of formData.entries()) {
            params.append(key, value);
        }

        const reportUrl = `${rsUrl}?IBIRS_action=run&IBIRS_service=ibfs&IBIRS_path=${encodeURIComponent(fullPath)}&${params.toString()}`;
        window.open(reportUrl, '_blank');
    });

    formContainer.appendChild(form);
}

