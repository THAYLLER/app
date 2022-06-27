import EncryptedStorage from 'react-native-encrypted-storage'
import CiclooService from "./CiclooService";

var behaviorData = null
const DEFAULT_STRUCTURE = () => ({
	openedScreens: 0,
	lastOpened: new Date(),
	signedIn: false,
	lastAction: new Date(),
	QRCodeScanLastTry: BehaviorService.QR_CODE_SCAN_STATUS.NO_TRY,
	QRCodeScanSuccesses: 0,
	QRCodeScanFailures: 0,
	gatheredCoins: false,
	lastGathered: new Date(),
	redeemed: false,
	lastPush: new Date(),
	canPush: true,
	cycleID: false
})
const DAY_IN_MILISSECONDS = 1000*60*60*24
class BehaviorService {
	static TYPES = {
		OPENED_SCREENS: "openedScreens",
		LAST_OPENED: "lastOpened",
		SIGNED_IN: "signedIn",
		LAST_ACTION: "lastAction",
		QR_CODE_SCAN_LAST_TRY: "QRCodeScanLastTry",
		QR_CODE_SCAN_SUCCESSES: "QRCodeScanSuccesses",
		QR_CODE_SCAN_FAILURES: "QRCodeScanFailures",
		GATHERED_COINS: "gatheredCoins",
		LAST_GATHERED: "lastGathered",
		REDEEMED: "redeemed",
		LAST_PUSH: "lastPush",
		CAN_PUSH: "canPush",
		CYCLE_ID: "cycleID",
	}
	static QR_CODE_SCAN_STATUS = {
		NO_TRY: 'NO_TRY',
		SUCCESS: 'SUCCESS',
		FAILURE: 'FAILURE'
	}
	static MESSAGES = {
		RULE_2: 'Descubra todos os benefícios de fazer parte deste CICLOO! Volte para o app e confira!',
		RULE_3: 'Faça seu cadastro e aproveite todos os benefícios de fazer parte deste CICLOO!',
		RULE_4: 'Envie seus cupons fiscais com produtos das marcas participantes e aproveite os prêmios disponíceis no CICLOO!',
		RULE_5: 'Ganhar moedas no CICLOO é simples, escaneie o QR code ou digite o código da nota fiscal com os produtos das marcas participantes!',
		RULE_6: 'Parabéns! Você já possui moedas acumuladas no CICLOO! Envie mais cupons fiscais com produtos das marcas participantes, e aproveite as recompensas',
		RULE_7: 'Você já possui moedas disponíveis para trocar por recompensas no CICLOO! Acesse o App e aproveite!',
		RULE_8: 'Parabéns! Você já resgatou todas as recompensas deste CICLOO! Aguarde o início do próximo CICLOO para resgatar ainda mais prêmios!',
	}
	static async getBehaviorData(){
		try{
			let result = await EncryptedStorage.getItem('behaviorData')
			// console.log({behaviorData, result})
			let data = DEFAULT_STRUCTURE()
			if(result){
				data = JSON.parse(result)
				data.lastGathered = new Date(data.lastGathered)
				data.lastAction = new Date(data.lastAction)
				data.lastOpened = new Date(data.lastOpened)
				data.lastPush = new Date(data.lastPush)
			}
			// console.log({data})
			behaviorData = data
			return (behaviorData)
		}
		catch(error){
			// console.log({error})
			return (error)
		}
	}

	static async store(data) {
		try {
			// console.log({'storing data': data})
			return EncryptedStorage.setItem('behaviorData', data);
		} catch (error) {
			return Alert.alert(`Ocorreu um erro no efetuar o save: ${error}`);
		}
	}

	static async setBehavior(key, value){
		try{
			// console.log({behaviorData, key, value})
			behaviorData[key] = value
			await this.store(JSON.stringify({
				...behaviorData,
				lastGathered: behaviorData.lastGathered.getTime(),
				lastAction: behaviorData.lastAction.getTime(),
				lastOpened: behaviorData.lastOpened.getTime(),
				lastPush: behaviorData.lastPush.getTime(),
			}))
			// EncryptedStorage.setItem('behaviorData', )
			// console.log({behaviorData, resolve: true, key, value})
			return (true)
		}
		catch(e){
			// console.log({behaviorData, resolve: false, e})
			return (false)
		}
	}

	static async reset(){
		try{
			// console.log('reset!')
			behaviorData = DEFAULT_STRUCTURE()
			EncryptedStorage.setItem('behaviorData', JSON.stringify({
				...behaviorData,
				lastGathered: behaviorData.lastGathered.getTime(),
				lastAction: behaviorData.lastAction.getTime(),
				lastOpened: behaviorData.lastOpened.getTime(),
				lastPush: behaviorData.lastPush.getTime(),
			}))
			// console.log({behaviorData, resolve: true, key, value})
			return (true)
		}
		catch(e){
			// console.log({behaviorData, resolve: false})
			return (false)
		}
	}
	
	static async start(){
		// console.log('behavior start!')
		let result = await this.getBehaviorData()
		let lastDate = new Date()
		await this.setBehavior(this.TYPES.LAST_ACTION, lastDate)
		// console.log('LAST_ACTION set!')
		await this.setBehavior(this.TYPES.LAST_OPENED, lastDate)
		// console.log('LAST_OPENED set!')
		await this.setBehavior(this.TYPES.OPENED_SCREENS, result.openedScreens+1)
		// console.log('OPENED_SCREENS set!')
		return behaviorData
	}

	static async setOpenedScreens(){
		// await this.getBehaviorData()
		await this.setBehavior(this.TYPES.OPENED_SCREENS, behaviorData.openedScreens+1)
		// console.log('OPENED_SCREENS set to: ', behaviorData.openedScreens)
		await this.setBehavior(this.TYPES.LAST_ACTION, new Date())
		// console.log('LAST_ACTION set to: ', new Date(behaviorData.lastAction).toLocaleString('pt-br'))
		return behaviorData
	}

	static async setSignedIn(){
		await this.setBehavior(this.TYPES.SIGNED_IN, true)
		// console.log('SIGNED_IN set to: true')
		await this.setBehavior(this.TYPES.LAST_ACTION, new Date())
		// console.log('LAST_ACTION set to: ', new Date(behaviorData.lastAction).toLocaleString('pt-br'))
		return behaviorData
	}

	static async setSignedOut(){
		await this.setBehavior(this.TYPES.SIGNED_IN, false)
		// console.log('SIGNED_IN set to: false')
		await this.setBehavior(this.TYPES.LAST_ACTION, new Date())
		// console.log('LAST_ACTION set to: ', new Date(behaviorData.lastAction).toLocaleString('pt-br'))
		return behaviorData
	}

	static async setQrSuccess(){
		await this.setBehavior(this.TYPES.QR_CODE_SCAN_LAST_TRY, this.QR_CODE_SCAN_STATUS.SUCCESS)
		// console.log('QR_CODE_SCAN_LAST_TRY set to: SUCCESS')
		let qrSuccess = (BehaviorService.QRCodeScanSuccesses) ? BehaviorService.QRCodeScanSuccesses+1 : 1
		await this.setBehavior(this.TYPES.QR_CODE_SCAN_SUCCESSES, qrSuccess)
		// console.log('QR_CODE_SCAN_SUCCESSES set to: ', qrSuccess)
		await this.setBehavior(this.TYPES.LAST_ACTION, new Date())
		// console.log('LAST_ACTION set to: ', new Date(behaviorData.lastAction).toLocaleString('pt-br'))
		return behaviorData
	}

	static async setQrFailure(){
		await this.setBehavior(this.TYPES.QR_CODE_SCAN_LAST_TRY, this.QR_CODE_SCAN_STATUS.FAILURE)
		// console.log('QR_CODE_SCAN_LAST_TRY set to: FAILURE')
		let qrFailures = (BehaviorService.QRCodeScanFailures) ? BehaviorService.QRCodeScanFailures+1 : 1
		await this.setBehavior(this.TYPES.QR_CODE_SCAN_FAILURES, qrFailures)
		// console.log('QR_CODE_SCAN_FAILURES set to: ', qrFailures)
		await this.setBehavior(this.TYPES.LAST_ACTION, new Date())
		// console.log('LAST_ACTION set to: ', new Date(behaviorData.lastAction).toLocaleString('pt-br'))
		return behaviorData
	}

	static async FORCE__setParameter(key, value){
		await this.getBehaviorData()
		await this.setBehavior(key, value)
		// console.log(`${key} set to: ${value}`)
		// await this.setBehavior(this.TYPES.LAST_ACTION, new Date())
		// console.log('LAST_ACTION set to: ', new Date(behaviorData.lastAction).toLocaleString('pt-br'))
		return behaviorData
	}

	static async validateRules(){
		let {
			openedScreens,
			lastOpened,
			signedIn,
			lastAction,
			QRCodeScanLastTry,
			QRCodeScanSuccesses,
			QRCodeScanFailures,
			gatheredCoins,
			lastGathered,
			redeemed,
			lastPush,
			canPush,
			cycleID
		} = await this.getBehaviorData()

		// Validação de tempo de notificações (1 dia)
		let currDate = new Date().getTime()
		let lastDate = ( lastPush) ?  lastPush.getTime() :  lastAction.getTime()
		let main_diff = DAY_IN_MILISSECONDS
		if(currDate - lastDate < main_diff) return false;

		let dataBalance = await CiclooService.GetBalance()
		let vouchers = await CiclooService.GetVouchers()
		await this.setBehavior(this.TYPES.GATHERED_COINS, (dataBalance.balance > 0))
		await this.setBehavior(this.TYPES.REDEEMED, (vouchers.length > 0))
		if(dataBalance.balance > 0 && !lastGathered)
			await this.setBehavior(this.TYPES.LAST_GATHERED, new Date())
		
		let message = false
		let screens_pivot = 6
		let no_action_diff = DAY_IN_MILISSECONDS*15 // 15 dias
		let last_rescue_diff = DAY_IN_MILISSECONDS*10 // 10 dias
		let notRescued = (
			!lastGathered ||
			(
				!redeemed &&
				currDate - lastGathered?.getTime() > last_rescue_diff
			)
		)
		let openedAndSigned = (
			openedScreens >= screens_pivot &&
			signedIn
		)
		let QRCodeHasAnySuccess = (
			QRCodeScanLastTry == this.QR_CODE_SCAN_STATUS.SUCCESS ||
			QRCodeScanSuccesses > 0
		)
		// // regra 2
		if(
			openedScreens < screens_pivot &&
			!signedIn
		)
			message = this.MESSAGES.RULE_2
		// // regra 3
		if(
			openedScreens >= screens_pivot &&
			!signedIn
		)
			message = this.MESSAGES.RULE_3
		// // regra 4
		if(
			openedAndSigned &&
			currDate - lastAction.getTime() > no_action_diff
		)
			message = this.MESSAGES.RULE_4
		// // regra 5
		if(
			openedAndSigned &&
			QRCodeScanLastTry == this.QR_CODE_SCAN_STATUS.FAILURE
		)
			message = this.MESSAGES.RULE_5
		// // regra 6
		if(
			openedAndSigned &&
			QRCodeHasAnySuccess &&
			gatheredCoins
		)
			message = this.MESSAGES.RULE_6
		// // regra 7
		if(
			openedAndSigned &&
			QRCodeHasAnySuccess &&
			gatheredCoins &&
			notRescued
		)
			message = this.MESSAGES.RULE_7
		// // regra 8
		if(
			openedAndSigned &&
			redeemed
		){
			message = this.MESSAGES.RULE_8
			this.setBehavior(this.TYPES.CAN_PUSH, false) // habilitar caso sejam implementadas viradas de ciclo
		}
		if(message)
			this.setBehavior(this.TYPES.LAST_PUSH, new Date())
		return message
	}

	static checkParameter = parameter => behaviorData[parameter]
}

export default BehaviorService